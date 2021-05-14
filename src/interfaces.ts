export interface ACPISection {
  get?: Array<string>
  copy?: Array<string>
  compile?: Array<string>
  quirks?: Record<string, unknown>
}

export interface BooterSection {
  quirks?: Record<string, unknown>
}

export interface IGPUConnector {
  flags?: string
  index?: string
  pipe?: string
  type?: string
}

export interface DevicePropertiesSection {
  iGPU?: {
    igPlatformId: string
    deviceId: string
    connectors?: Record<string, IGPUConnector>
    unifiedmem?: string
  }
}

export interface KernelSection {
  kexts?: {
    get: Array<string>
    copy: Array<string>
  }
  quirks?: Record<string, unknown>
}

export interface MiscSection {
  boot?: Record<string, unknown>
  debug?: Record<string, unknown>
  security?: Record<string, unknown>
}

export interface NVRAMSection {
  bootArgs?: string
  lang: string
}

export interface PlatformSection {
  type: string
  serial: string
  boardSerial: string
  smUUID: string
}

export interface Composition {
  use: Text
  acpi: ACPISection
  booter: BooterSection
  deviceprops: DevicePropertiesSection
  kernel: KernelSection
  misc: MiscSection
  nvram: NVRAMSection
  platform: PlatformSection
  forceCopy?: Record<string, unknown>
}