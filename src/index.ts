import path from "node:path"
import fs from "node:fs"
import type { Plugin } from "vite"
import * as Genql from "@genql/cli"
import type { Config } from "@genql/cli/dist/config"

export interface Options {
  schemaFile: string
  events?: {
    onBuild?: boolean
    onServerStart?: boolean
    onFileChange?: boolean
  }
  config: Omit<Config, "schema">
}

export default function genql(options: Options): Plugin {
  let mode: string

  const onBuild = options?.events?.onBuild ?? true
  const onServerStart = options?.events?.onServerStart ?? true
  const onFileChange = options?.events?.onFileChange ?? true

  function runGenql() {
    const sourceFile = path.resolve(options.schemaFile)
    const config: Config = {
      ...options.config,
      schema: fs.readFileSync(sourceFile).toString(),
    }
    Genql.generate(config)
  }

  return {
    name: "vite-plugin-genql",

    config(_, env) {
      mode = env.command
    },

    buildStart() {
      if (mode === "build" && onBuild)
        runGenql()

      if (mode === "serve" && onServerStart)
        runGenql()
    },

    configureServer(server) {
      const sourceFile = path.resolve(options.schemaFile)

      const listener = async (filePath: string) => {
        if (filePath === sourceFile) {
          console.log(`The GraphQL schema has been changed`)
          runGenql()
        }
      }

      return () => {
        if (onFileChange) {
          server.watcher.on("add", listener)
          server.watcher.on("change", listener)
        }

        server.middlewares.use((_request, _response, next) => {
          next()
        })
      }
    },
  }
}
