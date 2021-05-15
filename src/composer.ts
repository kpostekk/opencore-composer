import Composition from "./interfaces/composition"
import {PlistObject} from "plist"
import mergeDeep from "merge-deep"

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
    return mergeDeep(
      config,
      this.generatePlatformUpdates()
    ) as PlistObject
  }
}
