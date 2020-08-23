#!/usr/bin/env node
"use strict";
var spawn = require("child_process").exec;
var checkPlatform = function () {
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
var openUrl = function (url, callback) {
    var command = checkPlatform();
    var child = spawn(command + " " + url);
    var errorText = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", function (data) {
        errorText += data;
    });
    child.stderr.on("end", function () {
        if (errorText.length > 0) {
            var error = new Error(errorText);
            if (callback != null) {
                callback(error);
            }
            else {
                throw error;
            }
        }
        else if (callback != null) {
            callback("Opened " + command + " " + url);
        }
    });
};
var bangHandler = function (bang) {
    switch (bang) {
        case "g":
            return "https://www.google.com/#q=";
        case "w":
            return "https://www.wikipedia.com/w/index.php?search=";
        default:
            throw new Error("Unsupported bang: " + bang);
    }
};
var run = function () {
    var args = process.argv.slice(2);
    var bang = args[0];
    var userArgs = process.argv.slice(3);
    console.log(userArgs);
    var handler = bangHandler(bang);
    var command = handler;
    userArgs.forEach(function (arg, index) {
        if (index > 0) {
            command += "_" + arg;
        }
        else {
            command += arg;
        }
    });
    openUrl(command, function (message) {
        console.log(message);
    });
};
run();
