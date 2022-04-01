"use strict";
require("v8-compile-cache");
const screen = require("electron").screen;
const app = require("electron").app;
const Window = require("electron").BrowserWindow; // jshint ignore:line
// const Tray = require("electron").Tray; // jshint ignore:line
const Menu = require("electron").Menu; // jshint ignore:line

const server = require("./server");

let mainWindow = null;

app.on("ready", function () {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new Window({
    width: width,
    height: height,
    autoHideMenuBar: false,
    useContentSize: true,
    resizable: true,
    show: false,
    webPreferences: {
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
    // webPreferences: {
    //   nodeIntegration: true,
    //   enableRemoteModule: true
    // }
    //  'node-integration': false // otherwise various client-side things may break
  });

  // mainWindow.loadURL("http://10.68.19.153:8080/");
  mainWindow.loadURL("http://172.20.10.10:8080/");

  // remove this for production
  var template = [
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.reload();
            }
          },
        },
        {
          label: "Toggle Full Screen",
          accelerator: (function () {
            if (process.platform === "darwin") {
              return "Ctrl+Command+F";
            } else {
              return "F11";
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          },
        },
        {
          label: "Toggle Developer Tools",
          accelerator: (function () {
            if (process.platform === "darwin") {
              return "Alt+Command+I";
            } else {
              return "Ctrl+Shift+I";
            }
          })(),
          click: function (item, focusedWindow) {
            if (focusedWindow) {
              focusedWindow.toggleDevTools();
            }
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  mainWindow.maximize();
  mainWindow.show();
  mainWindow.focus();
});

// shut down all parts to app after windows all closed.
app.on("window-all-closed", function () {
  app.quit();
});
