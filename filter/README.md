# SMART-TBI Newsfeed Filter

The SMART-TBI Newsfeed Filter is designed to let you customize your feed so that only posts you wish to see appear on your Facebook feed. If you get overwhelmed by the number or content of new stories on your Facebook feed, this aid lets you choose the types of posts that appear on your feed.

## Setup for Development

1. Clone GitHub repository: `git clone https://github.com/smart-tbi/smart-tbi`

2. Navigate to Directory: `cd filter`

3. Install dependencies with [npm](https://www.npmjs.com/): `npm install`

4. Run extension in new chrome instance: `npm run start:chrome`

5. This will open a new chrome window and will have the extension pre-installed for you to test. Any changes made to the source code will be re-compiled and updated on the extension.

## Create Production Build
1. Clone the repository, navigate to it and install dependencies as steps 1-3 above.

2. Replace `src/manifest.json` with `src/manifest.production.json`.

3. Start a production build: `npm run build`

4. A folder named `extension` with the production build files will be created.

5. Distribute this folder unpacked or compress to a .zip file and distribute.
