import {PlistObject} from "plist"

export function cleanConfig(config: PlistObject): PlistObject {
  const c = config as Record<string, any>

  delete c["#WARNING - 1"]
  delete c["#WARNING - 2"]
  delete c["#WARNING - 3"]
  delete c["#WARNING - 4"]

  c["ACPI"]["Add"] = []
  c["ACPI"]["Delete"] = []
  c["ACPI"]["Patch"] = []
  c["Booter"]["MmioWhitelist"] = []
  c["Booter"]["Patch"] = []
  c["Kernel"]["Block"] = []
  c["Kernel"]["Force"] = []
  c["Kernel"]["Patch"] = []
  c["Misc"]["Entries"] = []

  return c
}