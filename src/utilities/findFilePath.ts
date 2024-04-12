// find closest index to provided path
// author: https://api.github.com/user/126257393 (elturpin)

import fs from "fs"
import path from "path"

export function findFilePath(
  reqPath: string = "/",
  absRoot: string = process.cwd(),
  index: string = "index.html",
  nestingLimit: number = 8,
  strictTrailingSlash: boolean = true
): string | undefined {
  if (strictTrailingSlash) reqPath = reqPath.slice(0, reqPath.lastIndexOf("/"))
  const dirs = reqPath.split("/", nestingLimit + 1)

  while (dirs.length > 0) {
    const pathToTest = path.join(absRoot, ...dirs, index)
    if (fs.existsSync(pathToTest)) return path.posix.join("/", ...dirs, index)
    dirs.pop()
  }
}
