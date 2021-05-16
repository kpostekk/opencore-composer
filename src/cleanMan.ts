import Composition from './interfaces/composition'
import { copySync, readdirSync, removeSync } from 'fs-extra'

export default class FileMan {
  private readonly composition: Composition

  constructor (composition: Composition) {
    this.composition = composition
  }

  copyMissingACPI (acpiPath: string, assetsPath: string) {
    for (const acpiName of this.composition.acpi?.copy ?? []) {
      if (!readdirSync(acpiPath).includes(acpiName)) {
        try {
          copySync(assetsPath + acpiName, acpiPath + acpiName)
          console.log('Copy ' + acpiName + ' to ACPI directory')
        } catch (err) {
          console.warn(err)
        }
      }
    }
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

  cleanTools (toolsPath: string) {
    readdirSync(toolsPath).forEach((filePath) => {
      if (!this.composition.uefi.tools?.includes(filePath) ?? []) {
        removeSync(toolsPath + filePath)
        console.log('Removed ' + filePath + ' from Tools directory')
      }
    })
  }
}
