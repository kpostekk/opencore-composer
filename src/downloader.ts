import { writeFile } from 'fs-extra'
import fetch from 'node-fetch'
import AdmZip from "adm-zip"

export default class Downloader {
  private readonly dlPath: string

  private readonly links = {
    OpenCore: 'https://github.com/acidanthera/OpenCorePkg/releases/download/{v}/OpenCore-{v}-{b}.zip',
    AcidantheraKexts: 'https://github.com/acidanthera/{k}/releases/download/{v}/{k}-{v}-{b}.zip'
  }

  constructor (downloadPath: string) {
    this.dlPath = downloadPath
  }

  async downloadOpenCore (version: string, build: string = 'RELEASE') {
    const response = await fetch(
      this.links.OpenCore
        .replaceAll('{v}', version)
        .replaceAll('{b}', build)
    )
    await writeFile(
      this.dlPath + 'OpenCore-{v}-{b}.zip'
        .replaceAll('{v}', version)
        .replaceAll('{b}', build),
      await response.buffer()
    )
  }

  async downloadAcidantheraKext (kext: string, version: string, build: string = 'RELEASE') {
    const response = await fetch(
      this.links.AcidantheraKexts
        .replaceAll('{v}', version)
        .replaceAll('{b}', build)
        .replaceAll('{k}', kext)
    )
    if (response.status === 404) {
      throw Error(`"${kext}" is not an AcidantheraKexts!`)
    }
    const kextZip = new AdmZip(await response.buffer())
    kextZip.extractEntryTo(`${kext}.kext/`, this.dlPath + `/${kext}.kext/`)
  }
}
