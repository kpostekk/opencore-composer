import {Composition} from "./interfaces"
import YAML from "yaml"
import * as plist from "plist"
import * as fs from "fs"
import {compileDeviceProperties} from "./devicePropsCompiler"

const composeFile = fs.readFileSync("scratches/oc-compose.yml")
const targetFile = fs.readFileSync("Sample.plist")

const composition: Composition = YAML.parse(composeFile.toString())
const config = new Map(Object.entries(plist.parse(targetFile.toString())))

config.get('DeviceProperties').Add."PciRoot(0x0)/Pci(0x1b,0x0)" = ""

console.log(config)
