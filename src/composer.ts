import Composition from './interfaces/composition'
import { PlistObject } from 'plist'
import mergeDeep from 'merge-deep'
import { AcpiAdd } from './interfaces/acpiAdd'
import { KextEntry } from './interfaces/kextEntry'
import logger from './logger'

export default class Composer {
  readonly composition: Composition

  constructor (composition: Composition) {
    this.composition = composition
  }

  private generateAcpiAdd () {
    return {
      ACPI: {
        Add: this.composition.acpi?.copy?.map((name) => {
          const addEntry: AcpiAdd = {
            Comment: '',
            Enabled: true,
            Path: name
          }
          return addEntry
        }) ?? []
      }
    }
  }

  // TODO: implement ACPI quirks
  // TODO: implement Booter quirks
  // TODO: implement iGPU
  // TODO: implement Kernel kexts copy

  checkGetKextsInCopySection () {
    for (const kext of this.composition.kernel.kexts.get ?? []) {
      const [name] = kext.split(':')
      if (!this.composition.kernel.kexts.copy.includes(name)) {
        logger.warn(`Kext ${name} IS NOT mentioned in copy section!`)
      }
    }
  }

  generateKexts () {
    return {
      Kernel: {
        Add: this.composition.kernel.kexts.copy.map((kextName) => {
          const kextEntry: KextEntry = {
            Arch: 'Any',
            BundlePath: `${kextName}.kext`,
            Comment: '',
            Enabled: true,
            ExecutablePath: 'Contents/MacOS/' + kextName,
            MaxKernel: '',
            MinKernel: '',
            PlistPath: 'Contents/Info.plist'

          }
          return kextEntry
        })
      }
    }
  }

  // TODO: implement Kernel quirks

  private generateMisc () {
    return {
      Misc: {
        Boot: this.composition.misc?.boot ?? {},
        Debug: this.composition.misc?.debug ?? {},
        Security: this.composition.misc?.security ?? {}
      }
    }
  }

  // TODO: implement NVRAM

  private generateDrivers () {
    return {
      UEFI: {
        Drivers: this.composition.uefi.drivers
      }
    }
  }

  private generatePlatformUpdates () {
    return {
      PlatformInfo: {
        Generic: {
          MLB: this.composition.platform.boardSerial,
          SystemProductName: this.composition.platform.type,
          SystemSerialNumber: this.composition.platform.serial,
          SystemUUID: this.composition.platform.smUUID
        }
      }
    }
  }

  // cleaning config and target
  private static removeWarnings (config: Record<string, any>): PlistObject {
    delete config['#WARNING - 1']; delete config['#WARNING - 2']; delete config['#WARNING - 3']; delete config['#WARNING - 4']
    return config
  }

  private static cleanConfigBeforeMerge (config: Record<string, any>): PlistObject {
    config = this.removeWarnings(config)
    config['#Copyright'] = 'Generated by OC Composer'

    config.ACPI.Add = []
    config.ACPI.Delete = []
    config.ACPI.Patch = []
    config.Booter.MmioWhitelist = []
    config.Booter.Patch = []
    config.Kernel.Add = []
    config.Kernel.Block = []
    config.Kernel.Force = []
    config.Kernel.Patch = []
    config.UEFI.Drivers = []
    config.Misc.Tools = []

    return config
  }

  mergeWith (config: PlistObject): PlistObject {
    config = Composer.cleanConfigBeforeMerge(config)

    return mergeDeep(
      config,
      this.generateAcpiAdd(),
      this.generateMisc(),
      this.generateDrivers(),
      this.generateKexts(),
      this.generatePlatformUpdates()
    ) as PlistObject
  }
}
