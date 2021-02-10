import axios from "axios";
import { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from "esbuild-wasm";
import localForage from "localforage";

const fileCache = localForage.createInstance({
    name: "fileCache",
});

const fetchPlugin = (inputCode: string): Plugin => {
    return {
        name: "fetch-plugin",
        setup(build: PluginBuild) {
            build.onLoad({ filter: /(^index\.js$)/ }, () => {
                return {
                    loader: "jsx",
                    contents: inputCode,
                };
            });

            build.onLoad({ filter: /.*/ }, async (args: OnLoadArgs) => {
                const cacheResult = await fileCache.getItem<OnLoadResult>(args.path);

                if (cacheResult) {
                    return cacheResult;
                }
            });

            build.onLoad({ filter: /.css$/ }, async (args: OnLoadArgs) => {
                const { data, request } = await axios.get(args.path);

                const escaped = data
                    .replace(/\n/g, "")
                    .replace(/"/g, '\\"')
                    .replace(/'/g, "\\'");

                const contents = `
                        const style = document.createElement("style");
                        style.innerText = "${escaped}";
                        document.head.appendChild(style);
                      `;

                const result: OnLoadResult = {
                    loader: "jsx",
                    contents,
                    resolveDir: new URL("./", request.responseURL).pathname,
                };

                await fileCache.setItem(args.path, result);

                return result;
            });

            build.onLoad({ filter: /.*/ }, async (args: OnLoadArgs) => {
                const { data, request } = await axios.get(args.path);

                const result: OnLoadResult = {
                    loader: "jsx",
                    contents: data,
                    resolveDir: new URL("./", request.responseURL).pathname,
                };

                await fileCache.setItem(args.path, result);

                return result;
            });
        },
    };
};

export { fetchPlugin };
