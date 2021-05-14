import {Composition} from "./interfaces"
import YAML from "yaml"
import * as plist from "plist"
import {PlistObject} from "plist"
import * as fs from "fs"
import {compileDeviceProperties} from "./devicePropsCompiler"
import {mergeIGPUDeviceProps, directMerge} from "./merge"

// open files
const composeFile = fs.readFileSync("scratches/oc-compose.yml")
const targetFile = fs.readFileSync("Sample.plist")

// parse files
const composition = YAML.parse(composeFile.toString()) as Composition
let config = plist.parse(targetFile.toString()) as PlistObject

// download OC



// compile iGPU patches
const patches = compileDeviceProperties(composition.deviceprops)
config = mergeIGPUDeviceProps(config, patches!) as PlistObject

// do direct merges
const merged = directMerge(config, composition)

// save
fs.writeFileSync("config.plist", plist.build(merged))

config.get('DeviceProperties').Add."PciRoot(0x0)/Pci(0x1b,0x0)" = ""

console.log(config)
