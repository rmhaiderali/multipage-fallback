// https://github.com/honojs/node-server/blob/d35311d6920e4dec80c10e0a23ccaa17cf5e12ae/src/serve-static.ts

import fs from "fs"
import { getMimeType } from "./getMimeType"
import type { ReadStream } from "fs"
import type { Context } from "hono"

const createStreamBody = (stream: ReadStream) => {
  const body = new ReadableStream({
    start(controller) {
      stream.on("data", (chunk) => {
        controller.enqueue(chunk)
      })
      stream.on("end", () => {
        controller.close()
      })
    },

    cancel() {
      stream.destroy()
    },
  })
  return body
}

export default function (c: Context, filePath: string) {
  const mimeType = getMimeType(filePath)
  if (mimeType) {
    c.header("Content-Type", mimeType)
  }

  const stat = fs.lstatSync(filePath)
  const size = stat.size

  c.header("Content-Length", size.toString())

  if (c.req.method == "HEAD" || c.req.method == "OPTIONS") {
    c.status(200)
    return c.body(null)
  }

  return c.body(createStreamBody(fs.createReadStream(filePath)), 200)
}
