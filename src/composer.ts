import Composition from './interfaces/composition'
import { PlistObject } from 'plist'

export default class Composer {
  readonly composition: Composition

  constructor (composition: Composition) {
    this.composition = composition
  }

  mergeWith (config: PlistObject): PlistObject {
    console.log('A')
    return { ...config }
  }
}
