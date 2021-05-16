import Composition from './interfaces/composition'
import { copy, readdir, remove } from 'fs-extra'
import logger from "./logger"

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
          logger.info('Copy ' + acpiName + ' to ACPI directory')
        } catch (err) {
          logger.warn(err)
        }
      }
    }
  }

  async copyMissingDrivers (driversPath: string, assetsPath: string) {
    for (const driverName of this.composition.uefi.drivers) {
      if (!(await readdir(driversPath)).includes(driverName)) {
        try {
          await copy(assetsPath + driverName, driversPath + driverName)
          logger.info('Copy ' + driverName + ' to Drivers directory')
        } catch (err) {
          logger.warn(err)
        }
      }
    }
  }

  async cleanDrivers (driversPath: string) {
    for (const filePath of await readdir(driversPath)) {
      if (!this.composition.uefi.drivers.includes(filePath)) {
        await remove(driversPath + filePath)
        logger.debug('Removed ' + filePath + ' from Drivers directory')
      }
    }
  }

  async cleanTools (toolsPath: string) {
    for (const filePath of await readdir(toolsPath)) {
      if (!this.composition.uefi.tools?.includes(filePath) ?? []) {
        await remove(toolsPath + filePath)
        logger.debug('Removed ' + filePath + ' from Tools directory')
      }
    }
  }
}
