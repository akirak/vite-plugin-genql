import { Plugin } from 'vite';
import { Config } from '@genql/cli/dist/config';

type Options = {
    schemaFile: string;
    events?: {
        onBuild?: boolean;
        onServerStart?: boolean;
        onFileChange?: boolean;
    };
    config: Omit<Config, "schema">;
};
declare function genql(options: Options): Plugin;

export { type Options, genql as default };
