#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Composer from './composer'
import { mkdirpSync, pathExists, readFileSync, writeFileSync } from 'fs-extra'
import * as YAML from 'YAML'
import * as plist from 'plist'
import { PlistObject } from 'plist'
import Packer from './packer'
import Composition from './interfaces/composition'
import getValidation from './validator'
import FileMan from './cleanMan'
import { initComposition } from './initComposition'
import Downloader from './downloader'
import logger from './logger'

const argv = yargs(hideBin(process.argv))
  .options({
    init: { type: 'boolean', description: 'Create required files and folders.' },
    download: { type: 'boolean', description: 'Only download referenced files.' },
    output: { type: 'string', default: 'target/EFI/OC/config.plist' },
    input: { type: 'string', default: 'assets/build/Docs/Sample.plist' },
    composition: { type: 'string', default: 'oc-compose.yml' },
    assets: { type: 'string', default: 'assets/', description: 'Specify directory to keep all downloaded assets.' },
    target: { type: 'string', default: 'target/', description: 'Specify directory with baked EFI.' }
  })
  .argv

logger.info('Starting OpenCore Composer', argv)

if (argv.init) {
  mkdirpSync(argv.target)
  mkdirpSync(argv.assets)
  writeFileSync(argv.composition, YAML.stringify(initComposition))
  process.exit()
}

async function mainRun () {
  // define composition manager
  const composer = new Composer(
    YAML.parse(readFileSync(argv.composition).toString()) as Composition
  )
  const composition = composer.composition
  // define files managers
  const packer = new Packer(argv.assets, argv.target, argv.assets + 'build/')
  const fileman = new FileMan(composition, argv.assets)
  const downloader = new Downloader(argv.assets)

  // download OpenCore if not present
  if (!(await pathExists(argv.assets + `OpenCore-${composition.use}.zip`)) || argv.download) {
    await downloader.downloadOpenCore(composition.use.split('-')[0], composition.use.split('-')[1])
  } else logger.warn(`Using bundled OpenCore (${composition.use})`, { use: composition.use })

  // move files
  packer.unpackOpenCore(`OpenCore-${composition.use}.zip`, composition.arch)

  // download kexts TODO: pack into method
  await downloader.downloadKexts(composition)
  composer.checkGetKextsInCopySection()
  logger.info(`Downloaded ${composition.kernel.kexts.get?.length ?? 0} kexts`, { downloadList: composition.kernel.kexts.get })

  if (argv.download) { logger.warn('Exit after download, --download passed'); process.exit() }

  // copy
  logger.info('Coping files to target', { target: argv.target })
  await Promise.all([
    fileman.copyMissingACPI(argv.target + 'EFI/OC/ACPI/'),
    fileman.copyMissingDrivers(argv.target + 'EFI/OC/Drivers/'),
    fileman.copyKexts(argv.target + 'EFI/OC/Kexts/')
  ])

  // and clean
  logger.info('Cleaning target', { target: argv.target })
  await Promise.all([
    fileman.cleanDrivers(argv.target + 'EFI/OC/Drivers/'),
    fileman.cleanTools(argv.target + 'EFI/OC/Tools/')
  ])

  // save
  writeFileSync(argv.output, plist.build(
    composer.mergeWith(
      plist.parse(readFileSync(argv.input).toString()) as PlistObject
    )
  ))
  logger.info('Saved config file', { location: argv.output, source: argv.input })

  // validate
  getValidation(argv.assets + 'build/', argv.output)
}

mainRun()
  .catch((err: Error) => logger.error(err.name, err))
  .then(() => process.exit())
