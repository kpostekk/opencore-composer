import Composition from './interfaces/composition'
import { PlistObject } from 'plist'

export default class Composer {
  readonly composition: Composition

  constructor (composition: Composition) {
    this.composition = composition
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
    console.log('A')
    return { ...config }
  }
}
