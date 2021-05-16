#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Composer from './composer'
import { mkdirpSync, readFileSync, writeFileSync, pathExists } from 'fs-extra'
import * as yaml from 'YAML'
import * as plist from 'plist'
import { PlistObject } from 'plist'
import Packer from './packer'
import Composition from './interfaces/composition'
import getValidation from './validator'
import FileMan from './cleanMan'
import { initString } from './initComposition'
import Downloader from './downloader'

const argv = yargs(hideBin(process.argv))
  .options({
    init: { type: 'boolean' },
    output: { type: 'string', default: 'target/EFI/OC/config.plist' },
    input: { type: 'string', default: 'assets/build/Docs/Sample.plist' },
    composition: { type: 'string', default: 'oc-compose.yml' },
    assets: { type: 'string', default: 'assets/' },
    target: { type: 'string', default: 'target/' }
  })
  .argv

console.log(argv, process.cwd())

if (argv.init) {
  mkdirpSync(argv.target)
  mkdirpSync(argv.assets)
  writeFileSync(argv.composition, initString)
  process.exit()
}

async function mainRun () {
  // define composition manager
  const composer = new Composer(
    yaml.parse(readFileSync(argv.composition).toString()) as Composition
  )
  const composition = composer.composition
  // define files managers
  const packer = new Packer(argv.assets, argv.target, argv.assets + 'build/')
  const fileman = new FileMan(composition)
  const downloader = new Downloader(argv.assets)

  // download OpenCore if not present
  if (!(await pathExists(argv.assets + `OpenCore-${composition.use}.zip`))) {
    await downloader.downloadOpenCore(composition.use.split('-')[0], composition.use.split('-')[1])
  } else console.log('Using downloaded', `OpenCore-${composition.use}.zip`)

  // move files
  packer.unpackOpenCore(`OpenCore-${composition.use}.zip`, composition.arch)

  await downloader.downloadKexts(composition)

  // save
  writeFileSync(argv.output, plist.build(
    composer.mergeWith(
      plist.parse(readFileSync(argv.input).toString()) as PlistObject
    )
  ))

  // copy
  await Promise.all([
    fileman.copyMissingACPI(argv.target + 'EFI/OC/ACPI/', argv.assets),
    fileman.copyMissingDrivers(argv.target + 'EFI/OC/Drivers/', argv.assets)
  ])
  // and clean
  await Promise.all([
    fileman.cleanDrivers(argv.target + 'EFI/OC/Drivers/'),
    fileman.cleanTools(argv.target + 'EFI/OC/Tools/')
  ])

  // validate
  getValidation(argv.assets + 'build/', argv.output)
}

mainRun()
  // .catch((err: Error) => console.error(err.name + ':', err.message))
  .then(() => process.exit())
