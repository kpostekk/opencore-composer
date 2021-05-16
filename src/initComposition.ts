import Composition from './interfaces/composition'
import { Arch } from './interfaces/archs'

export const initComposition: Composition = {
  arch: Arch.X64,
  directCopy: {},
  kernel: { kexts: { copy: ['Lilu.kext', 'VirtualSMC.kext'] }, quirks: {} },
  platform: { boardSerial: '', serial: '', smUUID: '', type: '' },
  uefi: { drivers: ['HfsPlus.efi', 'OpenRuntime.efi', 'OpenCanopy.efi'] },
  use: '0.CHANGE.ME-RELEASE'
}

export const initString = 'arch: X64\n' +
  'use: 0.CHANGE.ME-RELEASE\n' +
  '\n' +
  'kernel:\n' +
  '  kexts:\n' +
  '    copy:\n' +
  '      - Lilu.kext\n' +
  '      - VirtualSMC.kext\n' +
  '  quirks:\n' +
  '\n' +
  'platform:\n' +
  '  boardSerial: ""\n' +
  '  serial: ""\n' +
  '  smUUID: ""\n' +
  '  type: ""\n' +
  '  \n' +
  'uefi:\n' +
  '  drivers:\n' +
  '    - HfsPlus.efi\n' +
  '    - OpenRuntime.efi\n' +
  '    - OpenCanopy.efi\n' +
  '\n' +
  'directCopy:\n'
