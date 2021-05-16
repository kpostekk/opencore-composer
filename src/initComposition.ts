import Composition from './interfaces/composition'
import { Arch } from './interfaces/archs'

export const initComposition: Composition = {
  use: '0.CHANGE.ME-RELEASE',
  arch: Arch.X64,
  acpi: {
    copy: ['SSDT-AWAC.aml', 'SSDT-PLUG-DRTNIA.aml', 'SSDT-EC-USBX-DESKTOP.aml'],
    quirks: {}
  },
  kernel: {
    kexts: {
      copy: ['Lilu.kext', 'VirtualSMC.kext']
    },
    quirks: {}
  },
  misc: {
    boot: {},
    security: {},
    debug: {}
  },
  platform: { boardSerial: '', serial: '', smUUID: '', type: '' },
  uefi: { drivers: ['HfsPlus.efi', 'OpenRuntime.efi', 'OpenCanopy.efi'] },
  directCopy: {}
}
