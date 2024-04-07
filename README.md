# Vite Plugin for Genql

This is a [Genql](https://github.com/remorses/genql) plugin for Vite. It
regenerates client types every time a schema file (`*.graphql`) is updated or
when your project is built for production.

## Configuration

Below is an example where the source schema file is `./schema.graphql` and files
are generated into `src/generated` directory:

``` typescript
import { defineConfig } from 'vite';
import genql from 'vite-plugin-genql';

export default defineConfig({
  plugins: [
    genql({
      schemaFile: "./schema.graphql",
      config: {
        output: "src/generated",
      }
    }),
  ],
});
```

The full options are defined as follows:

``` typescript
export type Options = {
  schemaFile: string;
  events?: {
    onBuild?: boolean;
    onServerStart?: boolean;
    onFileChange?: boolean;
  },
  config: Omit<Config, "schema">
};
```

By default, the plugin regenerates your types in the following events:

- When the entire project is built (`onBuild`)
- When the schema file is updated (`onFileChange`)

The following events are disabled by default:

- When the server starts (`onServerStart`)

You can set extra options for Genql via `config`.
