import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Composer from './composer'
import { readFileSync, writeFileSync } from 'fs-extra'
import * as yaml from 'YAML'
import * as plist from 'plist'
import { PlistObject } from 'plist'

const argv = yargs(hideBin(process.argv))
  .options({
    output: { type: 'string', default: 'repo/EFI/OC/config.plist' },
    input: { type: 'string', default: 'repo/Docs/Sample.plist' },
    composition: { type: 'string', default: 'oc-compose.yml' }
  })
  .argv

console.log(argv)

const composition = yaml.parse(readFileSync(argv.composition).toString())
const composer = new Composer(composition)

// save
writeFileSync(argv.output, plist.build(
  composer.mergeWith(
    plist.parse(readFileSync(argv.input).toString()) as PlistObject
  )
))
