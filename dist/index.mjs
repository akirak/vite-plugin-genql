import path from 'node:path';
import fs from 'node:fs';
import * as Genql from '@genql/cli';

function genql(options) {
  let mode;
  const onBuild = options?.events?.onBuild ?? true;
  const onServerStart = options?.events?.onServerStart ?? false;
  const onFileChange = options?.events?.onFileChange ?? true;
  async function runGenql() {
    const sourceFile = path.resolve(options.schemaFile);
    const config = {
      ...options.config,
      schema: fs.readFileSync(sourceFile).toString()
    };
    await Genql.generate(config);
  }
  return {
    name: "vite-plugin-genql",
    config(_, env) {
      mode = env.command;
    },
    async buildStart() {
      if (mode === "build" && onBuild)
        await runGenql();
      if (mode === "serve" && onServerStart)
        await runGenql();
    },
    async configureServer(server) {
      const sourceFile = path.resolve(options.schemaFile);
      const listener = async (filePath) => {
        if (filePath === sourceFile) {
          console.log(`The GraphQL schema has been changed`);
          await runGenql();
        }
      };
      return () => {
        if (onFileChange) {
          server.watcher.on("add", listener);
          server.watcher.on("change", listener);
        }
        server.middlewares.use((_request, _response, next) => {
          next();
        });
      };
    }
  };
}

export { genql as default };
