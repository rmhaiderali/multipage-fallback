import fs from "fs";
import path from "path";
import { MiddlewareHandler as HonoMiddleware } from "hono";
import findFilePath from "../utilities/findFilePath";

export default function ({
  root = "/dist/",
  index = "index.html",
  nestingLimit = 5,
} = {}): HonoMiddleware {
  const absRoot = path.join(process.cwd(), root);

  return async (c, next) => {
    const filePath = findFilePath(c.req.path, absRoot, index, nestingLimit);
    if (!filePath) return next();

    return c.html(fs.readFileSync(filePath, "utf-8"));
  };
}
