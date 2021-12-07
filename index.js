// Dependencies
const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
   // squirrel event handled and app will exit in 1000ms, so don't do anything else
   return;
}

const electron = require('electron');
const { app, BrowserWindow, Menu, clipboard, dialog} = electron;
const client = require('discord-rich-presence')("750914713977749556");

// Load version from package.json
const { version } = require("./package.json");

let load = './base/loading.html'
let url = "https://dash.bluefoxhost.com";
let date = new Date();
let loading;
let win;

// Auto Updater
require('update-electron-app')({
    repo: 'DAREALYTYGRUNN1NGARK456/BlueFoxHost-App',
    updateInterval: '1 hour',
    logger: require('electron-log')
})

// Loads modules
let helper = require('./modules/functions.js');

app.on('ready', async () => {

    helper.initHearbeat(60000);

    win = new BrowserWindow({
        icon: "./images/icon/bluefox.ico",
        center: true,
        resizable: true,
        show: false,
        width: 1500,
        height: 900,
        minWidth: 1050,
        minHeight: 650,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    loading = new BrowserWindow({
        icon: "./images/icon/bluefox.ico",
        center: true,
        resizable: true,
        frame: false,
        width: 1500,
        height: 900,
        minWidth: 1050,
        minHeight: 650,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // win.webContents.getURL();
    var menu = Menu.buildFromTemplate([
        {
            label: 'Home',
            click() { 
                win.loadURL('https://bluefoxhost.com')
            } 
        },
        {
            label: 'Discord',
            click() { 
                win.loadURL('https://discord.bluefoxhost.com')
            } 
        },
        {
            label: 'Pages',
            submenu: [
                {
                    label: 'Status',
                    click() { 
                        win.loadURL('https://status.bluefoxhost.com')
                    } 
                },
                {
                    label: 'Billing',
                    click() { 
                        win.loadURL('https://billing.bluefoxhost.com')
                    } 
                },
                {
                    label: 'Public Panel',
                    click() { 
                        win.loadURL('https://panel.bluefoxhost.com')
                    } 
                },
                {
                    label: 'Staff Panel',
                    click() { 
                        win.loadURL('https://staff.bluefoxhost.com')
                    } 
                },
                {
                    label: 'Haste',
                    click() { 
                        win.loadURL('https://haste.bluefoxhost.com')
                    } 
                },
                {
                    label: 'Mail',
                    click() { 
                        win.loadURL('https://mail.bluefoxhost.com')
                    } 
                }
            ]
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Copy Current URL',
                    click() {
                        clipboard.writeText(win.webContents.getURL())
                    }
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu); 

    loading.removeMenu();
    loading.loadFile(load);
    win.loadURL(url);

    win.webContents.on('did-finish-load', () => {
        win.webContents.insertCSS(`
    
            ::-webkit-scrollbar
            {
                width: 20px;
                background-color: #1e1d37;
            }

            ::-webkit-scrollbar-track
            {
                border-radius: 10px;
                background-color: #1e1d37;
            }
    
            ::-webkit-scrollbar-thumb
            {
                border-radius: 10px;
                background-color: #2a2949;
            }
    
            ::-webkit-scrollbar-thumb:hover {
                background: #23223f; 
            }
        `);
    });

    win.webContents.on("devtools-opened", () => {
        win.webContents.closeDevTools();
    });

    loading.webContents.on("devtools-opened", () => {
        win.webContents.closeDevTools();
    });

    win.once('ready-to-show', async() => {
        loading.destroy();
        win.show();
    });

    loading.on('closed', () => {
        loading = null;
    })

    win.on('closed', () => {
        win = null;
    });

    win.on('page-title-updated', async () => {
        await client.updatePresence({
            state: win.webContents.getTitle().split(" - ")[1],
            details: win.webContents.getTitle().split(" - ")[0],
            startTimestamp: date,
            largeImageKey: "bluefox",
            largeImageText: "BlueFoxHost.com",
            smallImageKey: "info",
            smallImageText: `v${version}`
        });
    })

    win.on('focus', async () => {
        await client.updatePresence({
            state: win.webContents.getTitle().split(" - ")[1],
            details: win.webContents.getTitle().split(" - ")[0],
            startTimestamp: date,
            largeImageKey: "bluefox",
            largeImageText: "BlueFoxHost.com",
            smallImageKey: "info",
            smallImageText: `v${version}`
        });
    });

    app.on('browser-window-blur', async () => {
        setTimeout(function() {
            if (win.isFocused()) return;
            client.updatePresence({
                details: "Idle",
                startTimestamp: new Date(),
                largeImageKey: "idle",
                largeImageText: "BlueFoxHost.com",
                smallImageKey: "info",
                smallImageText: `v${version}`
            });
            date = new Date();
        }, 30000)
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    });

});
