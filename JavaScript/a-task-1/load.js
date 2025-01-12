const fs = require("node:fs").promises;
const vm = require("node:vm");

module.exports = (config) => async (filePath, sandbox) => {
  const src = await fs.readFile(filePath, "utf8");
  const code = `'use strict';\n${src}`;
  const script = new vm.Script(code);

  console.log({ script });
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  const exported = script.runInContext(context, config);
  console.log({ exported });

  return exported;
};
