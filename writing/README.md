# SMART-TBI Post Writing Aids

The post writing aid is designed to assist you in creating and writing clearer Facebook posts. If you struggle with spelling/grammar or deciding if your post is “appropriate”, this aid provides corrections and insight into the impression viewers may gather from your post.

## Prerequisites

**IMPORTANT:** TBI Post Writing Aids Extension utilizes [Perspective API](https://www.perspectiveapi.com/) and [TextGears API](https://textgears.com/) for profanity check and grammar check, respectively. Sign up for a free account to obtain your API keys and provide them in `src/api-keys.js`.

## Setup for Development

1. Clone GitHub repository: `git clone https://github.com/smart-tbi/smart-tbi`

2. Navigate to Directory: `cd writing`

3. Install dependencies with [npm](https://www.npmjs.com/): `npm install`

4. Run extension in new chrome instance: `npm run start:chrome`

5. This will open a new chrome window and will have the extension pre-installed for you to test. Any changes made to the source code will be re-compiled and updated on the extension.

## Create Production Build
1. Clone the repository, navigate to it and install dependencies as steps 1-3 above.

2. Replace `src/manifest.json` with `src/manifest.production.json`.

3. Start a production build: `npm run build`

4. A folder named `extension` with the production build files will be created.

5. Distribute this folder unpacked or compress to a .zip file and distribute.

