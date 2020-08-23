#!/usr/bin/env node
const spawn = require("child_process").exec;

const checkPlatform = () => {
  switch (process.platform) {
    case "darwin":
      return "open";
    case "win32":
      return "start";
    case "linux":
      return "xdg-open";
    default:
      throw new Error("Unsupported platform: " + process.platform);
  }
};

const openUrl = (url: string, callback: Function) => {
  const command = checkPlatform();
  const child = spawn(command + " " + url);
  let errorText = "";
  child.stderr.setEncoding("utf8");
  child.stderr.on("data", (data: string) => {
    errorText += data;
  });
  child.stderr.on("end", () => {
    if (errorText.length > 0) {
      const error = new Error(errorText);
      if (callback != null) {
        callback(error);
      } else {
        throw error;
      }
    } else if (callback != null) {
      callback("Opened " + command + " " + url);
    }
  });
};

const bangHandler = (bang: string) => {
  switch (bang) {
    case "g":
      return "https://www.google.com/#q=";
    case "w":
      return "https://www.wikipedia.com/w/index.php?search=";
    default:
      throw new Error("Unsupported bang: " + bang);
  }
};

const run = () => {
  const args = process.argv.slice(2);
  const bang = args[0];
  const userArgs = process.argv.slice(3);

  const handler = bangHandler(bang);
  let command = handler;
  userArgs.forEach((arg, index) => {
    if (index > 0) {
      command += "_" + arg;
    } else {
      command += arg;
    }
  });
  openUrl(command, (message: string) => {
    console.log(message);
  });
};

run();
