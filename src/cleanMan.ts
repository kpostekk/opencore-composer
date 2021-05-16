import Composition from './interfaces/composition'
import { copySync, readdirSync, removeSync } from 'fs-extra'

export default class FileMan {
  private readonly composition: Composition

  constructor (composition: Composition) {
    this.composition = composition
  }

  copyMissingDrivers (driversPath: string, assetsPath: string) {
    for (const driverName of this.composition.uefi.drivers) {
      if (!readdirSync(driversPath).includes(driverName)) {
        try {
          copySync(assetsPath + driverName, driversPath + driverName)
          console.log('Copy ' + driverName + ' to Drivers directory')
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }

  cleanDrivers (driversPath: string) {
    readdirSync(driversPath).forEach((filePath) => {
      if (!this.composition.uefi.drivers.includes(filePath)) {
        removeSync(driversPath + filePath)
        console.log('Removed ' + filePath + ' from Drivers directory')
      }
    })
  }
}