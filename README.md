# 🪀 Multipage Fallback

> Fallback unhandled requests to the nearest specified index within your single or multi page applications

[![npm](https://img.shields.io/npm/v/multipage-fallback?labelColor=24292E&color=cf2b2b)](https://www.npmjs.org/package/multipage-fallback)
[![downloads](https://img.shields.io/npm/dt/multipage-fallback?labelColor=24292E&color=0c9943)](https://www.npmjs.org/package/multipage-fallback)
[![size](https://img.shields.io/bundlephobia/minzip/multipage-fallback?labelColor=24292E&color=0c53b0)](https://www.npmjs.org/package/multipage-fallback)
[![license](https://img.shields.io/npm/l/multipage-fallback?labelColor=24292E&color=e0a804)](https://www.npmjs.org/package/multipage-fallback)

- [How does it work?](#-how-does-it-work)
- [Use with Express](#-use-with-express)
- [Use with Hono](#-use-with-hono)
- [Use with Vite](#-use-with-vite)

## Introduction <!-- omit in toc -->

The `multipage-fallback` package is intended for managing unhandled requests in multipage applications. It automatically serves the nearest index file based on your configuration, with or without redirecting requests. This is especially beneficial when developing web applications that consist of multiple pages and routes.

With `multipage-fallback`, allows your application to gracefully handle situations where a specific route is not found. Instead of showing a 404 error page, the package will fallback to the nearest index file, providing a smooth user experience.

To use `multipage-fallback`, you simply need to install the package and configure it according to your project's needs. The package integrates seamlessly with popular frameworks and build tools, making it easy to incorporate into your existing development workflow.

## How does it work?

Suppose you have the following source code structure:

```md
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    ├── nested.js
    └── subroute
        └─ index.html
```

`multipage-fallback` attempts to locate an `index.html` file that best matches the requested path. For instance, if the path is `/nested/subroute/my/secret/path`, the following file paths will be considered in order:

1. `nested/subroute/my/secret/index.html`
2. `nested/subroute/my/index.html`
3. `nested/subroute/index.html`
4. `nested/index.html`
5. `index.html`

In this situation, `nested/subroute/index.html` is selected because that file exists. If it were not available, the fallback would then be `nested/index.html`, and if that were also absent, it would further fall back to `index.html` at the root level.

The reason `nested/subroute/my/secret/path/index.html` is not considered in this process is due to the absence of a trailing `/`. If you want to include this path, you can set the `strictTrailingSlash` option to `false`.

## Use with Express

#### 📄 express.js

Always remember to include the `multipage-fallback` middleware at the very end of your app.

```js
import express from "express"
import { expressMiddleware as multipageFallback } from "multipage-fallback"

const app = express()

// your routes/middlewares

app.use(multipageFallback())

app.listen(3000)
```

#### ⚙️ Options

| Name                   | Default Value      | Valid Types        |
| ---------------------- | ------------------ | ------------------ |
| root                   | `"./dist/"`        | `string`           |
| index                  | `"index.html"`     | `string`           |
| nestingLimit           | `8`                | `number`           |
| sendOptions            | [`SendOptions`][1] | [`SendOptions`][1] |
| strictTrailingSlash    | `true`             | `boolean`          |
| redirect               | `false`            | `boolean`          |
| redirectRegex          | `/(?:)/`           | `RegExp`           |
| redirectRemoveFileName | `true`             | `boolean`          |

## Use with Hono

#### 📄 hono.js

Always remember to include the `multipage-fallback` middleware at the very end of your app.

```js
import { Hono } from "hono"
import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { honoMiddleware as multipageFallback } from "multipage-fallback"

const app = new Hono()

// your routes/middlewares

app.use("/*", multipageFallback())

serve({ fetch: app.fetch, port: 3000 })
```

#### ⚙️ Options

| Name                   | Default Value  | Valid Types |
| ---------------------- | -------------- | ----------- |
| root                   | `"./dist/"`    | `string`    |
| index                  | `"index.html"` | `string`    |
| nestingLimit           | `8`            | `number`    |
| strictTrailingSlash    | `false`         | `boolean`   |
| redirect               | `false`        | `boolean`   |
| redirectRegex          | `/(?:)/`       | `RegExp`    |
| redirectRemoveFileName | `true`         | `boolean`   |

## Use with Vite

#### 📄 vite.config.js

```js
import { vitePlugin as multipageFallback } from "multipage-fallback"

export default defineConfig({
  appType: "mpa",
  plugins: [multipageFallback()],
})
```

#### ⚙️ Options

| Name                   | Default Value  | Valid Types |
| ---------------------- | -------------- | ----------- |
| index                  | `"index.html"` | `string`    |
| nestingLimit           | `8`            | `number`    |
| strictTrailingSlash    | `true`         | `boolean`   |
| redirect               | `false`        | `boolean`   |
| redirectRegex          | `/(?:)/`       | `RegExp`    |
| redirectRemoveFileName | `true`         | `boolean`   |

## License <!-- omit in toc -->

MIT

[1]: https://expressjs.com/en/api.html#res.sendFile
