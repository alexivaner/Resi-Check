<div align="center"> 

# Sumber Berkat Resi Checker

![image](https://github.com/alexivaner/Resi-Check/assets/57290644/e9116732-4cdf-45aa-9173-bf2f589621bf)

</div>

## About

Resi Checker is a versatile shipping data management application designed to streamline and enhance the process of tracking and managing shipments. It provides users with an intuitive and feature-rich platform to handle various aspects of shipping data. Some of its key functionalities include:

1. **Dark Mode and Color Scheme**: Resi Checker offers a visually comfortable experience with both Dark and Light modes, adapting to your system's color scheme preference.
2. **Search and Filtering**: Users can easily search and filter shipping data based on different criteria such as tracking number ("resiInput"), date, and provider. Preset date ranges simplify data retrieval.
3. **Provider Detection**: The app employs advanced regular expressions to accurately identify shipping providers based on tracking numbers. A confirmation popup helps ensure data accuracy.
4. **Edit and Delete**: Resi Checker enables editing of existing shipping entries, allowing modifications to data with the ability to save changes. A confirmation prompt prevents accidental deletions.
5. **About and Summary Modals**: The "About" modal provides insights into the app's features, while the "Summary" modal presents an overview of shipping data. Both modals enhance user navigation.
6. **Code Optimization**: The code has been refined for improved readability and maintainability, making the app more robust and easier to manage.
7. **Data Persistence**: Resi Checker interacts seamlessly with data storage, utilizing JSON files to load and save shipping data, ensuring data persistence.
8. **Summary Features**: The app includes a Date Range Selector for flexible date filtering, a Bar Chart to visualize provider data, and a Summary Data section for key metrics.

Overall, Resi Checker is a comprehensive shipping data management solution that empowers users to efficiently track, organize, and analyze shipment information while providing a visually appealing and user-friendly interface.

## Getting started

Clone this repository: `git clone git@github.com:Deluze/electron-vue-template.git`


### Install dependencies ⏬

```bash
npm install
```

### Start developing ⚒️

```bash
npm run dev
```

## Additional Commands

```bash
npm run dev # starts application with hot reload
npm run build # builds application, distributable files can be found in "dist" folder

# OR

npm run build:win # uses windows as build target
npm run build:mac # uses mac as build target
npm run build:linux # uses linux as build target
```

Optional configuration options can be found in the [Electron Builder CLI docs](https://www.electron.build/cli.html).
## Project Structure

```bash
- scripts/ # all the scripts used to build or serve your application, change as you like.
- src/
  - main/ # Main thread (Electron application source)
  - renderer/ # Renderer thread (VueJS application source)
```

## Using static files

If you have any files that you want to copy over to the app directory after installation, you will need to add those files in your `src/main/static` directory.

#### Referencing static files from your main process

```ts
/* Assumes src/main/static/myFile.txt exists */

import {app} from 'electron';
import {join} from 'path';
import {readFileSync} from 'fs';

const path = join(app.getAppPath(), 'static', 'myFile.txt');
const buffer = readFileSync(path);
```
