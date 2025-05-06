import { createWriteStream } from "node:fs";
import archiver from "archiver";
import path from "node:path";

const distPath = path.resolve(process.cwd(), "tmp");
async function createLibsZip() {
    const output = createWriteStream(path.join(distPath, "libs.zip"));
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.directory(path.join(distPath, "node_modules"), "");
    archive.pipe(output);

    await Promise.all([
        archive.finalize(),
        new Promise((resolve) => output.on("close", resolve)),
    ]);

    console.log("打包完成: libs.zip (", archive.pointer(), "bytes )");
}

createLibsZip().catch(console.error);
