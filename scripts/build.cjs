const { getPublishDirectory } = require('../../AppDock.at365/scripts/publish-paths.cjs');
const fs = require("node:fs"),
  path = require("node:path"),
  cp = require("node:child_process");
const root = path.resolve(__dirname, "..");
const host = process.argv.includes("--host")
  ? path.resolve(process.argv[process.argv.indexOf("--host") + 1])
  : path.resolve(root, "../AppDock.at365");
cp.execFileSync(
  process.execPath,
  [
    path.join(host, "node_modules/typescript/bin/tsc"),
    "-p",
    path.join(root, "tsconfig.json"),
  ],
  { stdio: "inherit", windowsHide: true },
);
if (process.argv.includes("--test"))
  cp.execFileSync(
    process.execPath,
    ["--test", path.join(root, "tests/applet.test.cjs")],
    { stdio: "inherit", windowsHide: true },
  );
if (process.argv.includes("--publish")) {
  const output =
    process.argv[process.argv.indexOf("--publish") + 1] ||
    path.join(getPublishDirectory(root), "Applet.WebBrowserTools.at365");
  fs.mkdirSync(output, { recursive: true });
  fs.copyFileSync(
    path.join(root, "out/index.js"),
    path.join(output, "index.js"),
  );
  fs.copyFileSync(
    path.join(root, "extension.json"),
    path.join(output, "extension.json"),
  );
  // Only obsolete program files; never remove Applet settings or data.
  for (const name of [
    "Applet.WebBrowserTools.at365.exe",
    "Applet.WebBrowserTools.at365.dll",
    "Applet.WebBrowserTools.at365.deps.json",
    "Applet.WebBrowserTools.at365.runtimeconfig.json",
    "AppDock.SDK.dll",
    "AppDock.Runtime.dll",
    "AppDock.SDK.pdb",
    "AppDock.Runtime.pdb",
  ]) {
    const file = path.join(output, name);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  console.log("Applet output: " + output);
}
