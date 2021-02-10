import { OnResolveArgs, Plugin, PluginBuild } from "esbuild-wasm";

export const unpkgPathPlugin = (): Plugin => {
    return {
        name: "unpkg-path-plugin",
        setup(build: PluginBuild) {
            // Handle root entry file of "index.js" (users code)
            build.onResolve({ filter: /(^index\.js$)/ }, (args: OnResolveArgs) => {
                return { path: args.path, namespace: "a" };
            });

            // Handle relative paths in a NPM module
            build.onResolve({ filter: /^\.+\// }, async (args: OnResolveArgs) => {
                return {
                    path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
                    namespace: "a",
                };
            });

            // Handle main file of a NPM module
            build.onResolve({ filter: /.*/ }, async (args: OnResolveArgs) => {
                return {
                    path: `https://unpkg.com/${args.path}`,
                    namespace: "a",
                };
            });
        },
    };
};
