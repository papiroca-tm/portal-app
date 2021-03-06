const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const { Menu, Tray } = require('electron')

let appIcon = null
app.on('ready', () => {
  appIcon = new Tray('./ico.jpeg')
  const contextMenu = Menu.buildFromTemplate([
    // { label: 'Открыть портал', click() { console.log('Открыть портал') } },
    {
      label: 'Войти', click() {
        console.log('Войти')
        showLoginWindow()
      }
    },
    { label: 'Выйти', enabled: false, click() { console.log('Выйти') } },
    {
      label: 'Закрыть', click() {
        console.log('Закрыть')
        app.quit();
      }
    }
  ])
  // Call this again for Linux because we modified the context menu
  appIcon.setContextMenu(contextMenu)
})

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function showLoginWindow() {
  createWindow()
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    // width: 800, height: 600,
    // modal: true,
    // center: true,
    // alwaysOnTop: true,
    // closable: false,
    // x: 200,
    // y: 200,
    // fullscreen: true
    // frame: false
  })


  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))
  mainWindow.center()
  mainWindow.maximize()
  mainWindow.setMenu(null)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  // mainWindow.on('closed', function () {
  //   // Dereference the window object, usually you would store windows
  //   // in an array if your app supports multi windows, this is the time
  //   // when you should delete the corresponding element.
  //   mainWindow = null
  // })
  mainWindow.webContents.on('new-window', function (e, url,fn,d,o,af) {
    // e.preventDefault();
    // console.dir(url)
    // console.dir(fn)
    // console.dir(d)
    // console.dir(o)
    // console.dir(af)
    require('electron').shell.openExternal('');
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

// app.on('activate', function () {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (mainWindow === null) {
//     createWindow()
//   }
// })

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and require them here.
