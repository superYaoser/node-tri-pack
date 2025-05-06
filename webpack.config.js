// webpack.config.js
const path = require("path");
const { BannerPlugin } = require("webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = (options) => {
    console.log(new Date().toLocaleTimeString(), "webpack.config.js 开始编译");
    const isProd = process.env.RUNNING_ENV === "prod";
    console.log("isProd:", isProd);
    const tsconfigFileName = path.resolve(
        __dirname,
        isProd ? "tsconfig.build-prod.json" : "tsconfig.build-dev.json"
    );

    return {
        entry: "./src/main.ts",
        target: "node",
        mode: isProd ? "production" : "development",
        externalsPresets: { node: true },
        externals: [nodeExternals()],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            configFile: tsconfigFileName,
                        },
                    },
                    include: path.resolve(__dirname, "src"),
                },
            ],
        },
        plugins: [
            new BannerPlugin({
                banner: 'require("reflect-metadata");',
                raw: true,
            }),
        ],
        resolve: {
            extensions: [".ts", ".js"],
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },
        output: {
            filename: "main.js",
            path: path.resolve(__dirname, "tmp"),
            libraryTarget: "commonjs2",
        },
        optimization: {
            minimize: isProd,
            moduleIds: "deterministic",
        },
        node: {
            __dirname: false,
            __filename: false,
        },
    };
};
