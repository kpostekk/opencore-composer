import { Arch } from './archs'

type Dictionary<T> = Record<string, T>

export default interface Composition {
  use: string
  arch: Arch
  acpi?: {
    copy?: Array<string>
    // TODO: add delete
    // TODO: add patch
    quirks?: Dictionary<any>
  }
  booter?: {
    // TODO: add mimo
    // TODO: add patch
    quirks?: Dictionary<any>
  }
  iGPU?: {
    platformId?: string
    deviceId?: string
    connectors?: Dictionary<{
      flags?: string
      index?: string
      pipe?: string
      type?: string
      busID?: string
    }>
    binaryProperties?: Dictionary<string>
    textProperties?: Dictionary<string>
  }
  kernel: {
    kexts: {
      copy: Array<string>
    }
    // TODO: add block
    // TODO: add emulate
    // TODO: add force
    // TODO: add patch
    quirks: Dictionary<any>
    // TODO: add scheme
  }
  misc?: {
    boot?: Dictionary<any>
    debug?: Dictionary<any>
    // TODO: add entries
    security?: Dictionary<any>
    // TODO: add tools
  }
  nvram?: {
    bootArgs?: string
    lang: string
  }
  platform: {
    type: string
    serial: string
    boardSerial: string
    smUUID: string
  }
  uefi: {
    drivers: Array<string>
    tools?: Array<string>
  }
  directCopy: Dictionary<Dictionary<any>>
}
