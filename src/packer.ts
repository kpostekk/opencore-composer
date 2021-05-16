import AdmZip from 'adm-zip'
import { Arch } from './interfaces/archs'
import { renameSync, removeSync, pathExistsSync, mkdirSync } from 'fs-extra'

export default class Packer {
  /*
  This class provides support for:
   - Unpacking zips
   */
  private readonly path: string
  private readonly target: string
  private readonly build: string
  private activeZipFile?: AdmZip

  constructor (assetsPath: string, targetPath: string, buildPath: string) {
    this.path = assetsPath
    this.target = targetPath
    this.build = buildPath
  }

  private clearTargetAndBuild () {
    if (pathExistsSync(this.target)) removeSync(this.target)
    if (pathExistsSync(this.build)) removeSync(this.build)
  }

  unpackOpenCore (zipName: string, arch: Arch) {
    this.clearTargetAndBuild()

    const zipPath = this.path + zipName
    this.activeZipFile = new AdmZip(zipPath)

    this.extractEFI(arch)
    this.extractUtils()
    this.extractDocs()
  }

  private extractEFI (arch: Arch) {
    this.activeZipFile!.extractEntryTo(`${arch.toString()}/EFI/`, this.target)
    renameSync(this.target + `${arch.toString()}/EFI/`, this.target + 'EFI/')
    removeSync(this.target + `${arch.toString()}/`)

    // add missing paths
    const missingPaths = [
      'EFI/OC/ACPI/',
      'EFI/OC/Kexts/',
      'EFI/OC/Resources/Audio/',
      'EFI/OC/Resources/Font/',
      'EFI/OC/Resources/Image/',
      'EFI/OC/Resources/Label/'
    ]
    missingPaths.forEach((p) => {
      mkdirSync(this.target + p, { recursive: true })
    })
  }

  private extractUtils () {
    this.activeZipFile!.extractEntryTo('Utilities/', this.build)
  }

  private extractDocs () {
    this.activeZipFile!.extractEntryTo('Docs/', this.build)
  }
}
