import { writeFile } from 'fs-extra'
import fetch from 'node-fetch'
import AdmZip from 'adm-zip'
import Composition from './interfaces/composition'
import logger from './logger'

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
    logger.debug('Downloading OpenCore', { version: version + build })

    const ocName = 'OpenCore-{v}-{b}.zip'
      .replaceAll('{v}', version)
      .replaceAll('{b}', build)

    const response = await fetch(
      this.links.OpenCore
        .replaceAll('{v}', version)
        .replaceAll('{b}', build)
    )

    await writeFile(
      this.dlPath + ocName,
      await response.buffer()
    )

    logger.debug('OpenCore saved', { as: ocName })
  }

  async downloadKexts (composition: Composition) {
    await Promise.all(composition.kernel.kexts.get!.map((kextName) => {
      const [kn, kv] = kextName.split(':')
      return this.downloadAcidantheraKext(kn, kv)
    }))
  }

  private async downloadAcidantheraKext (kext: string, version: string, build: string = 'RELEASE') {
    logger.debug('Downloading kext', { kextName: kext, version: version, build: build })

    const response = await fetch(
      this.links.AcidantheraKexts
        .replaceAll('{v}', version)
        .replaceAll('{b}', build)
        .replaceAll('{k}', kext)
    )

    if (response.status === 404) {
      throw Error(`"${kext}" is not an AcidantheraKexts!`)
    }

    logger.debug('Extracting downloaded kext', { kextName: kext, version: version, build: build })

    const kextZip = new AdmZip(await response.buffer())
    kextZip.extractAllTo(this.dlPath)
    logger.debug('Kext extracted', { kextName: kext, version: version, build: build })
  }
}
