import * as fs from "fs-extra";
import * as path from "path";

async function readPrefixFile(): Promise<void> {
    try {
        //1. 读取 prefix.js 内容
        const filePath: string = path.join(__dirname, "function", "prefix.js");
        const prefixContent: string = fs.readFileSync(filePath, "utf8");
        // 2. 确保 tmp 目录存在（自动创建缺失目录）
        if (!fs.existsSync(path.join(process.cwd(), "tmp"))) {
            throw new Error("tmp 目录不存在");
        }
        const tmpDir = path.join(process.cwd(), "tmp");
        await fs.ensureDir(tmpDir);

        // 3. 读取 main.js 现有内容（若存在）
        const mainPath = path.join(tmpDir, "main.js");
        let mainContent = "";
        if (await fs.pathExists(mainPath)) {
            mainContent = fs.readFileSync(mainPath, "utf8");
        }

        // 4. 合并内容（prefix 在前，原内容在后）
        const finalContent = `${prefixContent}\n${mainContent}`;

        // 5. 写入最终内容到 main.js
        await fs.writeFile(mainPath, finalContent, "utf8");
        console.log(`成功写入内容到 ${mainPath}`);
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "未知错误";
        console.error("操作失败：", errorMessage);
    }
}

// 执行函数
readPrefixFile();
