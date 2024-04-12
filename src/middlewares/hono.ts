import fs from "fs"
import path from "path"
import pc from "picocolors"
import sendFile from "../utilities/hono/sendFile"
import { findFilePath } from "../utilities/findFilePath"
import type { MiddlewareHandler } from "hono"

export type HonoMiddlewareOptions = {
  root?: string
  index?: string
  nestingLimit?: number
  strictTrailingSlash?: boolean
  redirect?: boolean
  redirectRegex?: RegExp
  redirectRemoveFileName?: boolean
}

export function honoMiddleware({
  root = "./dist/",
  index = "index.html",
  nestingLimit = 8,
  strictTrailingSlash = false,
  redirect = false,
  redirectRegex = /(?:)/,
  redirectRemoveFileName = true,
}: HonoMiddlewareOptions = {}): MiddlewareHandler {
  if (!path.isAbsolute(root)) root = path.join(process.cwd(), root)

  if (!fs.existsSync(root) || !fs.lstatSync(root).isDirectory())
    throw new Error(pc.red(root + " is not a directory"))

  if (!(redirectRegex instanceof RegExp))
    throw new Error(pc.red("redirectRegex must be a RegExp"))

  const mustEndWith = strictTrailingSlash ? "/" : ""

  return async (c, next) => {
    const filePath = findFilePath(
      c.req.path,
      root,
      index,
      nestingLimit,
      strictTrailingSlash
    )

    if (!filePath) return next()

    if (redirect) {
      const redirectPath = redirectRemoveFileName
        ? path.posix.join(path.dirname(filePath), mustEndWith)
        : filePath

      if (c.req.path !== redirectPath && c.req.path.match(redirectRegex))
        return c.redirect(redirectPath, 301)
    }

    return sendFile(c, path.join(root, filePath))
  }
}
