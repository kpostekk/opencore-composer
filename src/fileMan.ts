import Composition from './interfaces/composition'
import { copy, readdir, remove } from 'fs-extra'
import logger from './logger'

export default class FileMan {
  /*
  This class provides support for:
   - Remove redundant files
   - Copy .aml, .kext, .efi
   */
  private readonly composition: Composition
  private readonly assets: string

  constructor (composition: Composition, assetsPath: string) {
    this.composition = composition
    this.assets = assetsPath
  }

  async copyKexts (targetPath: string) {
    for (const kextName of this.composition.kernel.kexts.copy ?? []) {
      await copy(
        this.assets + kextName + '.kext/',
        targetPath + kextName + '.kext/',
        { recursive: true }
      )
    }
    logger.info(`Copied ${this.composition.kernel.kexts.copy.length ?? 0} kexts`, { copy: this.composition.kernel.kexts.copy })
  }

  async copyMissingACPI (acpiPath: string) {
    for (const acpiName of this.composition.acpi?.copy ?? []) {
      if (!(await readdir(acpiPath)).includes(acpiName)) {
        try {
          await copy(this.assets + acpiName, acpiPath + acpiName)
        } catch (err) {
          logger.crit('Copy failed', err)
        }
      }
    }
    logger.info(`Copied ${this.composition.acpi?.copy?.length ?? 0} ACPI patches`, { copy: this.composition.acpi?.copy })
  }

  async copyMissingDrivers (driversPath: string) {
    for (const driverName of this.composition.uefi.drivers) {
      if (!(await readdir(driversPath)).includes(driverName)) {
        try {
          await copy(this.assets + driverName, driversPath + driverName)
        } catch (err) {
          logger.crit('Copy failed', err)
        }
      }
    }
    logger.info(`Copied ${this.composition.uefi.drivers.length ?? 0} UEFI drivers`, { copy: this.composition.uefi.drivers })
  }

  async cleanDrivers (driversPath: string) {
    for (const filePath of await readdir(driversPath)) {
      if (!this.composition.uefi.drivers.includes(filePath)) {
        await remove(driversPath + filePath)
        logger.debug(`Removed unreferenced ${filePath} UEFI driver from Drivers directory`, { file: filePath })
      }
    }
  }

  async cleanTools (toolsPath: string) {
    for (const filePath of await readdir(toolsPath)) {
      if (!this.composition.uefi.tools?.includes(filePath) ?? []) {
        await remove(toolsPath + filePath)
        logger.debug(`Removed unreferenced UEFI ${filePath} tool from Tools directory`, { file: filePath })
      }
    }
  }
}
