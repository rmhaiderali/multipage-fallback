import path from "path"
import pc from "picocolors"
import { findFilePath } from "../utilities/findFilePath"
import type { IncomingMessage, ServerResponse } from "http"
import type { Plugin, ViteDevServer, Connect } from "vite"

export type VitePluginOptions = {
  index?: string
  nestingLimit?: number
  strictTrailingSlash?: boolean
  redirect?: boolean
  redirectRegex?: RegExp
  redirectRemoveFileName?: boolean
}

export function vitePlugin({
  index = "index.html",
  nestingLimit = 8,
  strictTrailingSlash = true,
  redirect = false,
  redirectRegex = /(?:)/,
  redirectRemoveFileName = true,
}: VitePluginOptions = {}): Plugin {
  const root = process.cwd()

  if (!(redirectRegex instanceof RegExp))
    throw new Error(pc.red("redirectRegex must be a RegExp"))

  const mustEndWith = strictTrailingSlash ? "/" : ""

  return {
    name: "multipageFallback",
    async configureServer(server: ViteDevServer) {
      function multipageFallback(
        req: IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction
      ) {
        const reqPath = req.url?.split("?")[0].split("#")[0] ?? "/"
        const filePath = findFilePath(
          reqPath,
          root,
          index,
          nestingLimit,
          strictTrailingSlash
        )

        if (!filePath) return next()

        if (redirect) {
          const redirectPath = redirectRemoveFileName
            ? path.dirname(filePath) + mustEndWith
            : filePath

          if (reqPath !== redirectPath && reqPath.match(redirectRegex)) {
            res.writeHead(302, { Location: redirectPath })
            return res.end()
          }
        }

        req.url = filePath
        next()
      }

      return async () => server.middlewares.use(multipageFallback)
    },
  }
}
