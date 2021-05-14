import fetch from "node-fetch"
import * as fs from "fs"

interface OCGitAsset {
  name: string
  browser_download_url: string
}

interface OCGitRelease {
  name: string
  tag_name: string
  body: string
  assets: Array<OCGitAsset>
}

export async function getOCPkgURL(version: string): Promise<OCGitRelease | undefined> {
  const response = await fetch("https://api.github.com/repos/acidanthera/OpenCorePkg/releases")
  const respObj = await response.json() as Array<OCGitRelease>
  return respObj.find(ocgr => ocgr.name == version || ocgr.tag_name == version)
}

export async function donwloadUrl(url: string, location: string): Promise<void> {
  const response = await fetch(url)
  await fs.promises.writeFile(location, await response.buffer())
}