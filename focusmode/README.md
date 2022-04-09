# SMART-TBI Focus Mode Extension

SMART-TBI Focus Mode Extension is a feature designed to eliminate the distraction of a cluttered newsfeed while you are viewing your friends’ and groups’ Facebook posts. If you sometimes have information overload while viewing your Newsfeed, this aid allows you view each post individually without surrounding distractions.

## Setup for Development

1. Clone GitHub repository: `git clone https://github.com/smart-tbi/smart-tbi/focusmode`

2. Navigate to Directory: `cd focusmode`

3. Install dependencies with [npm](https://www.npmjs.com/): `npm install`

4. Run extension in new chrome instance: `npm run start:chrome`

5. This will open a new chrome window and will have the extension pre-installed for you to test. Any changes made to the source code will be re-compiled and updated on the extension.

## Create Production Build

1. Clone the repository, navigate to it and install dependencies as steps 1-3 above.

2. Replace `src/manifest.json` with `src/manifest.production.json`.

3. Start a production build: `npm run build`

4. A folder named `extension` with the production build files will be created.

5. You can distribute this folder unpacked or compress to a .zip file and distribute.

6. Go to Chrome browser the go to -> "Settings" -> then go to "Extensions" or you can directly visit this link in your Chrome browser: "chrome://extensions/"

7. Click on "Load unpacked" and select the folder or .zip file from step 4 above.

8. Your extension should be loaded in Chrome and you can pin it from the top-right corner of the Toolbar. 