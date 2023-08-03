import { app, BrowserWindow, ipcMain, session, nativeTheme } from 'electron';
import { join } from 'path';

let mainWindow;
const fs = require("fs");
const path = require("path");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    icon: path.join(__dirname, 'renderer/icons/win/icon.ico'), // Update this path
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  }
  else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
  }

}

app.whenReady().then(() => {
  createWindow();

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['script-src \'self\'']
      }
    })
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });


});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})


ipcMain.on("ready", (event) => {
  console.log("I am ready");

  //Load JSON File
  mainWindow.webContents.send('loadFromJson', loadTableDataFromJSON());
});

ipcMain.on("saveToJson", (event, data) => {
  console.log("event in savetojson ", data);
  saveTableDataToJSON(data)
});

// IPC event handler for deleteToJson
ipcMain.on("deleteToJson", (event, entryKey) => {
  deleteEntryFromJSON(entryKey);
});



function saveTableDataToJSON(tableData) {
  const filePath = path.join(app.getPath('home')
    , "tableData.json");
  try {
    let existingData = {};
    try {
      const data = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(data);
    } catch (error) {
      console.error("Error reading table data from JSON file:", error);
    }

    const newlyAddedData = JSON.parse(tableData)

    // Merge the existing data with the newly added data
    const combinedData = { ...existingData, ...newlyAddedData };

    fs.writeFileSync(filePath, JSON.stringify(combinedData, null, 2));
    console.log("Newly added data saved to JSON file.");
  } catch (error) {
    console.error("Error saving table data to JSON file:", error);
  }
}

// Function to delete the entry from the JSON file
function deleteEntryFromJSON(entryKey) {
  const filePath = path.join(app.getPath('home'), "tableData.json");
  try {
    let existingData = {};
    try {
      const data = fs.readFileSync(filePath, "utf8");
      existingData = JSON.parse(data);
    } catch (error) {
      console.error("Error reading table data from JSON file:", error);
    }

    console.log("entry key is", entryKey);
    console.log("existing data  is", existingData);

    if (existingData.hasOwnProperty(entryKey)) {
      delete existingData[entryKey]; // Remove the entry with the given entryKey

      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      console.log("Entry deleted from JSON file.");
    } else {
      console.error("Entry not found in JSON file.");
    }
  } catch (error) {
    console.error("Error deleting entry from JSON file:", error);
  }
}

function loadTableDataFromJSON() {
  const filePath = path.join(app.getPath('home')
    , "tableData.json");
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return data;
  } catch (error) {
    console.error("Error loading table data from JSON file:", error);
    return {};
  }
}
