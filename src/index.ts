import {Composition} from "./interfaces"
import YAML from "yaml"
import * as plist from "plist"
import {PlistObject} from "plist"
import * as fs from "fs"
import {compileDeviceProperties} from "./devicePropsCompiler"
import {mergeIGPUDeviceProps, directMerge} from "./merge"
import {execFile} from "child_process"
import * as process from "process"

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

// validate
switch (process.platform) {

case "win32": execFile("ocvalidate/ocvalidate.exe", ['config.plist'], (err, data) => {
  console.error(data)
})
  break

case "darwin": execFile("ocvalidate/ocvalidate", ['config.plist'], (err, data) => {
  console.error(data)
})
  break

case "linux": execFile("ocvalidate/ocvalidate.linux", ['config.plist'], (err, data) => {
  console.error(data)
})
  break

default:
  console.warn("There isn't a compatible validator for your OS. Try on win32, darwin (macOS) or linux")
}
