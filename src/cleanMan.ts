import Composition from './interfaces/composition'
import { copy, readdir, remove } from 'fs-extra'

export default class FileMan {
  private readonly composition: Composition

  constructor (composition: Composition) {
    this.composition = composition
  }

  async copyMissingACPI (acpiPath: string, assetsPath: string) {
    for (const acpiName of this.composition.acpi?.copy ?? []) {
      if (!(await readdir(acpiPath)).includes(acpiName)) {
        try {
          await copy(assetsPath + acpiName, acpiPath + acpiName)
          console.log('Copy ' + acpiName + ' to ACPI directory')
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }

  async copyMissingDrivers (driversPath: string, assetsPath: string) {
    for (const driverName of this.composition.uefi.drivers) {
      if (!(await readdir(driversPath)).includes(driverName)) {
        try {
          await copy(assetsPath + driverName, driversPath + driverName)
          console.log('Copy ' + driverName + ' to Drivers directory')
        } catch (err) {
          console.warn(err)
        }
      }
    }
  }

  async cleanDrivers (driversPath: string) {
    for (const filePath of await readdir(driversPath)) {
      if (!this.composition.uefi.drivers.includes(filePath)) {
        await remove(driversPath + filePath)
        console.log('Removed ' + filePath + ' from Drivers directory')
      }
    }
  }

  async cleanTools (toolsPath: string) {
    for (const filePath of await readdir(toolsPath)) {
      if (!this.composition.uefi.tools?.includes(filePath) ?? []) {
        await remove(toolsPath + filePath)
        console.log('Removed ' + filePath + ' from Tools directory')
      }
    }
  }
}
