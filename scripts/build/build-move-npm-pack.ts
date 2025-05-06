import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface PackageJson {
    dependencies: Record<string, string>;
}

const projectDeps: PackageJson = require("../../package.json").dependencies;
const distPath: string = path.resolve(process.cwd(), "tmp");

if (!fs.existsSync(path.join(distPath, "package.json"))) {
    console.log("Generating package.json...");
    // 生成精简 package.json
    fs.writeFileSync(
        path.join(distPath, "package.json"),
        JSON.stringify(
            {
                name: "prod-package",
                version: "1.0.0",
                private: true,
                dependencies: Object.fromEntries(
                    Object.entries(projectDeps).filter(
                        ([name]) =>
                            !["typescript", "@types/*"].some((pattern) =>
                                name.match(pattern)
                            )
                    )
                ),
            },
            null,
            2
        )
    );
} else {
    console.log("package.json exists, skipping...");
}

copyFiles();

execSync("npm install --omit=dev", {
    cwd: distPath,
    stdio: "inherit",
});

function copyFiles(): void {
    fs.copyFileSync(
        path.join(process.cwd(), "package-lock.json"),
        path.join(distPath, "package-lock.json")
    );
}
