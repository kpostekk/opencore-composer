import {DevicePropertiesSection} from "./interfaces"

export function compileDeviceProperties(devProps: DevicePropertiesSection): Record<string, string> | null {
  if (devProps.iGPU == null) {
    return null
  }
  const igpu = devProps.iGPU
  const compileMap = new Map()

  // start with predefined
  compileMap.set("AAPL,ig-platform-id", igpu.igPlatformId)
  compileMap.set("device-id", igpu.deviceId)
  compileMap.set("framebuffer-unifiedmem", Buffer.from("00000080", "hex").toString("base64"))

  // patch connectors
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Object.entries(igpu.connectors!).forEach(([conName, conProps]) => {
    if (conProps.flags) compileMap.set(`framebuffer-${conName}-flags`, conProps.flags)
    if (conProps.index) compileMap.set(`framebuffer-${conName}-index`, conProps.index)
    if (conProps.pipe) compileMap.set(`framebuffer-${conName}-pipe`, conProps.pipe)
    if (conProps.type) compileMap.set(`framebuffer-${conName}-type`, conProps.type)
  })

  // convert to base64
  compileMap.forEach((v, k) => {
    compileMap.set(k, Buffer.from(v, "hex").toString("base64"))
  })

  return Object.fromEntries(compileMap)
}