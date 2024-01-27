/*
 * find closest index to provided path
 * author: https://api.github.com/user/126257393 (elturpin)
 */

import fs from "fs";
import path from "path";

export default function (
  reqPath: string,
  absRoot: string,
  index: string,
  nestingLimit: number
): string | undefined {
  const basePath = reqPath.slice(0, reqPath.lastIndexOf("/"));
  const dirs = basePath.split("/").slice(0, nestingLimit);

  while (dirs.length > 0) {
    const pathToTest = path.join(absRoot, ...dirs, index);
    if (fs.existsSync(pathToTest)) return pathToTest;
    dirs.pop();
  }
}
