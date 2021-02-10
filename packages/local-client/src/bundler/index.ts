import * as esbuild from "esbuild-wasm";

import { fetchPlugin } from "./plugins/fetchPlugin";
import { unpkgPathPlugin } from "./plugins/unpkgPathPlugin";

let service: esbuild.Service;

interface Bundler {
    (rawCode: string): Promise<{ code: string; error: string }>;
}

const bundler: Bundler = async (rawCode) => {
    if (!service) {
        service = await esbuild.startService({
            worker: true,
            wasmURL: "https://unpkg.com/esbuild-wasm@0.8.42/esbuild.wasm",
        });
    }

    try {
        const result = await service.build({
            entryPoints: ["index.js"],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
            define: {
                "process.env.NODE_ENV": "'production'",
                global: "window",
            },
            logLevel: "silent",
            jsxFactory: "_React.createElement",
            jsxFragment: "_React.Fragment",
        });

        return {
            code: result.outputFiles[0].text,
            error: "",
        };
    } catch (error) {
        console.error(error);
        return {
            code: "",
            error: error.message,
        };
    }
};

export default bundler;
