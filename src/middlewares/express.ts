import fs from "fs"
import path from "path"
import pc from "picocolors"
import { findFilePath } from "../utilities/findFilePath"
import type { RequestHandler } from "express"
import type { SendOptions } from "send"

export type ExpressMiddlewareOptions = {
  root?: string
  index?: string
  nestingLimit?: number
  sendOptions?: SendOptions
  strictTrailingSlash?: boolean
  redirect?: boolean
  redirectRegex?: RegExp
  redirectRemoveFileName?: boolean
}

export function expressMiddleware({
  root = "./dist/",
  index = "index.html",
  nestingLimit = 8,
  sendOptions = {},
  strictTrailingSlash = true,
  redirect = false,
  redirectRegex = /(?:)/,
  redirectRemoveFileName = true,
}: ExpressMiddlewareOptions = {}): RequestHandler {
  if (!path.isAbsolute(root)) root = path.join(process.cwd(), root)

  if (!fs.existsSync(root) || !fs.lstatSync(root).isDirectory())
    throw new Error(pc.red(root + " is not a directory"))

  if (!(redirectRegex instanceof RegExp))
    throw new Error(pc.red("redirectRegex must be a RegExp"))

  const mustEndWith = strictTrailingSlash ? "/" : ""

  return async (req, res, next) => {
    const filePath = findFilePath(
      req.path,
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

      if (req.path !== redirectPath && req.path.match(redirectRegex))
        return res.redirect(301, redirectPath)
    }

    res.sendFile(path.join(root, filePath), sendOptions)
  }
}
