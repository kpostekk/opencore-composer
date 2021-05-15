import { execFileSync } from 'child_process'

export default function getValidation (builderPath: string, configPath: string): void {
  const validatorsPath = builderPath + 'Utilities/ocvalidate/'
  let ocvalidator: string

  switch (process.platform) {
    case 'linux':
      ocvalidator = validatorsPath + 'ocvalidate.linux'
      break
    case 'win32':
      ocvalidator = validatorsPath + 'ocvalidate.exe'
      break
    case 'darwin':
      ocvalidator = validatorsPath + 'ocvalidate'
      break
    default:
      throw Error('This platform is not supported!')
  }

  try {
    console.log(execFileSync(ocvalidator, [configPath]).toString())
  } catch (e) {
    console.warn(e.stdout.toString())
  }
}
