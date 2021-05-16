import { writeFile } from 'fs-extra'
import fetch from 'node-fetch'
import AdmZip from 'adm-zip'
import Composition from './interfaces/composition'

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
    console.log('Downloading OpenCore ' + version, build)
    const response = await fetch(
      this.links.OpenCore
        .replaceAll('{v}', version)
        .replaceAll('{b}', build)
    )
    console.log('Saving OpenCore')
    await writeFile(
      this.dlPath + 'OpenCore-{v}-{b}.zip'
        .replaceAll('{v}', version)
        .replaceAll('{b}', build),
      await response.buffer()
    )
    console.log('OpenCore saved')
  }

  async downloadKexts (composition: Composition) {
    await Promise.all(composition.kernel.kexts.get!.map((kextName) => {
      const [kn, kv] = kextName.split(':')
      return this.downloadAcidantheraKext(kn, kv)
    }))
  }

  private async downloadAcidantheraKext (kext: string, version: string, build: string = 'RELEASE') {
    console.log('Downloading', kext, version, build)
    const response = await fetch(
      this.links.AcidantheraKexts
        .replaceAll('{v}', version)
        .replaceAll('{b}', build)
        .replaceAll('{k}', kext)
    )
    if (response.status === 404) {
      throw Error(`"${kext}" is not an AcidantheraKexts!`)
    }
    console.log('Extracting', kext, version, build)
    const kextZip = new AdmZip(await response.buffer())
    kextZip.extractAllTo(this.dlPath)
    console.log('Extracting finished for', kext, version, build)
  }
}
