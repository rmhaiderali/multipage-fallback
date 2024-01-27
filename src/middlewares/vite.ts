import type { IncomingMessage, ServerResponse } from "http";
import type { Plugin as VitePlugin, ViteDevServer, Connect } from "vite";
import findFilePath from "../utilities/findFilePath";

export default function ({
  index = "index.html",
  nestingLimit = 5,
} = {}): VitePlugin {
  const absRoot = process.cwd();

  return {
    name: "multipageFallback",
    async configureServer(server: ViteDevServer) {
      function multipageFallback(
        req: IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction
      ) {
        const reqPath = req.url?.split("?")[0].split("#")[0] ?? "/";
        const filePath = findFilePath(reqPath, absRoot, index, nestingLimit);

        if (filePath) req.url = filePath.slice(absRoot.length);
        next();
      }

      return async () => server.middlewares.use(multipageFallback);
    },
  };
}
