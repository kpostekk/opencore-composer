import Composition from './interfaces/composition'
import { PlistObject } from 'plist'
import mergeDeep from 'merge-deep'
import { AcpiAdd } from './interfaces/acpiAdd'

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
            Comment: 'Added by composer',
            Enabled: true,
            Path: name + '.aml'
          }
          return addEntry
        }) ?? []
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

  mergeWith (config: PlistObject): PlistObject {
    return mergeDeep(
      config,
      this.generateAcpiAdd(),
      this.generatePlatformUpdates()
    ) as PlistObject
  }
}
