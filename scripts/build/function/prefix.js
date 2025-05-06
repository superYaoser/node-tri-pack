/**
 * @see https://nodejs.cn/api/single-executable-applications.html
 * 必须: node -v > 22
 * 程序执行结果:
 * 将程序包中的 libs.zip 解压到目标文件夹，并且将node解析node_modules的默认行为改为 目标文件
 *
 */
(function () {
    if (!isSea()) {
        console.log("当前环境不是sea环境");
        return;
    }
    /**
     * 1. 修改require的引入方式
     */
    const { createRequire } = require("node:module"); //最关键的一步更改引入模块的引用方式（为了引入其他node_modules中的模块）
    require = createRequire(__filename);
    /**
     * 2. 定义文件路径
     */
    const path = require("path");
    const libsName = "libs";
    const libsAimPath = path.join(__dirname, libsName);
    /**
     * 3. 解压依赖包文件
     */
    releaseLibs(libsAimPath);
    /**
     * 4. 修改引入依赖包的路径为libs文件夹
     */
    patchRequire();

    // 修改模块解析路径
    function patchRequire() {
        process.env.NODE_PATH = libsAimPath;
        require("module").Module._initPaths();
        require = createRequire(__filename);
    }

    // 从exe中解压lib
    function releaseLibs(extractPath) {
        const zipFilePath = extractPath + ".zip";
        //引入依赖
        const { getAsset } = require("node:sea");
        const fs = require("fs");
        const { execSync } = require("child_process");
        const os = require("os");
        // 检查是否存在libs文件夹是否存在
        if (!fs.existsSync(extractPath)) {
            console.log("libs文件夹不存在，释放libs.zip资源");
            const zipArrayBuffer = getAsset("libs.zip");
            try {
                // 将 ArrayBuffer 转换为 Buffer
                const buffer = Buffer.from(zipArrayBuffer);

                // 使用 fs.writeFileSync 同步写入文件
                fs.writeFileSync(zipFilePath, buffer);
                console.log("libs压缩文件保存成功:", zipFilePath);
            } catch (err) {
                console.error("写入文件时出错:", err);
            }
        } else {
            console.log("libs文件夹存在，跳过解压操作");
            return;
        }
        const platform = os.platform();
        let command;

        switch (platform) {
            case "win32":
                command = `powershell -Command "Expand-Archive -Path '${zipFilePath}' -DestinationPath '${extractPath}' -Force"`;
                break;
            case "darwin":
                command = `unzip -o ${zipFilePath} -d ${extractPath}`;
                break;
            case "linux":
                command = `unzip -o ${zipFilePath} -d ${extractPath}`;
                break;
            default:
                console.error("不支持的操作系统");
                return;
        }

        try {
            execSync(command);
            console.log("解压完成");
            fs.unlinkSync(zipFilePath); //删除zip文件
            console.log("删除libs压缩文件成功");
        } catch (error) {
            console.error(`执行命令时出错: ${error.message}`);
        }
    }
    function isSea() {
        const { isSea } = require("node:sea");
        try {
            return isSea();
        } catch (e) {
            console.error("isSea()方法调用失败");
            return false;
        }
    }
})();
