import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Composer from './composer'
import { readFileSync, writeFileSync } from 'fs-extra'
import * as yaml from 'YAML'
import * as plist from 'plist'
import { PlistObject } from 'plist'
import Packer from './packer'
import Composition from './interfaces/composition'
import getValidation from './validator'

const argv = yargs(hideBin(process.argv))
  .options({
    output: { type: 'string', default: 'target/EFI/OC/config.plist' },
    input: { type: 'string', default: 'assets/build/Docs/Sample.plist' },
    composition: { type: 'string', default: 'oc-compose.yml' },
    assets: { type: 'string', default: 'assets/' },
    target: { type: 'string', default: 'target/' }
  })
  .argv

console.log(argv)

const composition = yaml.parse(readFileSync(argv.composition).toString()) as Composition
const composer = new Composer(composition)
const packer = new Packer(argv.assets, argv.target, argv.assets + 'build/')

// move files
// TODO: unpack utils
packer.unpackOpenCore(`OpenCore-${composition.use}.zip`, composition.arch)

// save
writeFileSync(argv.output, plist.build(
  composer.mergeWith(
    plist.parse(readFileSync(argv.input).toString()) as PlistObject
  )
))

// validate
getValidation(argv.assets + 'build/', argv.output)
