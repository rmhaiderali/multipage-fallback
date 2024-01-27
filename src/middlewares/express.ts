import fs from "fs";
import path from "path";
import { RequestHandler as ExpressMiddleware } from "express";
import findFilePath from "../utilities/findFilePath";

export default function ({
  root = "/dist/",
  index = "index.html",
  nestingLimit = 5,
} = {}): ExpressMiddleware {
  const absRoot = path.join(process.cwd(), root);

  return async (req, res, next) => {
    const filePath = findFilePath(req.path, absRoot, index, nestingLimit);
    if (!filePath) return next();

    return res.send(fs.readFileSync(filePath, "utf-8"));
  };
}
