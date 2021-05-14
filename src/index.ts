import {Composition} from "./interfaces"
import YAML from "yaml"
import * as plist from "plist"
import {PlistObject} from "plist"
import * as fs from "fs"
import * as fse from "fs-extra"
import {compileDeviceProperties} from "./devicePropsCompiler"
import {mergeIGPUDeviceProps, directMerge} from "./merge"
import {execFile} from "child_process"
import * as process from "process"
import {donwloadUrl} from "./downloader"
import {cleanConfig} from "./cleaner"
import AdmZip from "adm-zip"


// open files
const composeFile = fs.readFileSync("scratches/oc-compose.yml")
const targetFile = fs.readFileSync("Sample.plist")

// parse files
const composition = YAML.parse(composeFile.toString()) as Composition
let config = plist.parse(targetFile.toString()) as PlistObject

// download OC
(async () => await donwloadUrl(`https://github.com/acidanthera/OpenCorePkg/releases/download/${composition.use}/OpenCore-${composition.use}-RELEASE.zip`, `downloads/OpenCore-${composition.use}-RELEASE.zip`))();
(async () => await donwloadUrl("https://github.com/acidanthera/OcBinaryData/archive/refs/heads/master.zip", "downloads/OC-data.zip"))()

if (fs.existsSync("constructionZone/EFI")) {
  fs.rmSync("constructionZone/EFI", {recursive: true})
}

if (fs.existsSync("constructionZone/Utilities")) {
  fs.rmSync("constructionZone/Utilities", {recursive: true})
}

const oczip = new AdmZip(`downloads/OpenCore-${composition.use}-RELEASE.zip`)

// copy EFI to builder
oczip.extractEntryTo("X64/EFI/", "constructionZone/")

fs.renameSync("constructionZone/X64/EFI", "constructionZone/EFI")
fs.rmdirSync("constructionZone/X64")
fs.mkdirSync("constructionZone/EFI/OC/ACPI")
fs.mkdirSync("constructionZone/EFI/OC/Kexts")
fs.mkdirSync("constructionZone/EFI/OC/Resources")
fs.mkdirSync("constructionZone/EFI/OC/Resources/Audio")
fs.mkdirSync("constructionZone/EFI/OC/Resources/Font")
fs.mkdirSync("constructionZone/EFI/OC/Resources/Image")
fs.mkdirSync("constructionZone/EFI/OC/Resources/Label")

// copy ocvalidate
oczip.extractEntryTo("Utilities/", "constructionZone/")
fse.copySync("constructionZone/Utilities/ocvalidate", "ocvalidate", {recursive: true})

// copy aml
oczip.extractEntryTo("Docs/AcpiSamples/Binaries/", "constructionZone/")
fs.renameSync("constructionZone/Docs/AcpiSamples/Binaries", "constructionZone/aml")

// clean config
console.log("Cleaning config")
config = cleanConfig(config)

// compile iGPU patches
console.log("Adding iGPU patches")
config = mergeIGPUDeviceProps(config, compileDeviceProperties(composition.deviceprops) ?? {})

// do direct merges
console.log("Merging dictionaries")
const merged = directMerge(config, composition)

// save
fs.writeFileSync("config.plist", plist.build(merged))

// validate
console.log("Validating...")
switch (process.platform) {

case "win32": execFile("ocvalidate/ocvalidate.exe", ["config.plist"], (err, data) => {
  console.error(data)
})
  break

case "darwin": execFile("ocvalidate/ocvalidate", ["config.plist"], (err, data) => {
  console.error(data)
})
  break

case "linux": execFile("ocvalidate/ocvalidate.linux", ["config.plist"], (err, data) => {
  console.error(data)
})
  break

default:
  console.warn("There isn't a compatible validator for your OS. Try on win32, darwin (macOS) or linux")
}
