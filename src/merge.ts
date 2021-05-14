import {PlistObject, PlistValue} from "plist"
import {Composition} from "./interfaces"

export function mergeIGPUDeviceProps(config: PlistObject, patches: Record<string, string>): Record<string, unknown> {
  const mergingObject = {
    "DeviceProperties": {
      "Add": {
        "PciRoot(0x0)/Pci(0x2,0x0)": patches
      }
    }
  }

  return {...config, ...mergingObject}
}

export function directMerge(config: PlistObject, comp: Composition): Record<string, any> {
  const synthObject = {
    "ACPI": {
      "Quirks": comp.acpi.quirks
    },
    "Booter": {
      "Quirks": comp.booter.quirks
    },
    "Kernel": {
      "Quirks": comp.kernel.quirks
    },
    "Misc": {
      "Boot": comp.misc.boot,
      "Security": comp.misc.security,
      "Debug": comp.misc.debug
    },
    "NVRAM": {
      "Add": {
        "7C436110-AB2A-4BBB-A880-FE41995C9F82": {
          "boot-args": comp.nvram.bootArgs,
          "prev-lang:kbd": comp.nvram.lang
        }
      }
    },
    "PlatformInfo": {
      "Generic": {
        "SystemProductName": comp.platform.type,
        "SystemSerialNumber": comp.platform.serial,
        "MLB": comp.platform.boardSerial,
        "SystemUUID": comp.platform.smUUID,
      }
    }
  }

  const rawForcedCopy = comp.forceCopy ?? {}

  return {...synthObject, ...rawForcedCopy, ...config}
}