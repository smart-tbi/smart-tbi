# SMART-TBI Facebook Customization

The Facebook customization feature allows you to declutter your Facebook home page. You may keep the features and tabs you wish to continue seeing, while eliminating the ones you do not use, want, or need. If Facebook’s website is confusing or difficult for you to navigate, this aid makes Facebook easier to view and use for your specific needs, while decreasing the site’s amount of sensory and information overload.

## Setup for Development

1. Clone GitHub repository: `git clone https://github.com/smart-tbi/smart-tbi`

2. Navigate to Directory: `cd customization`

3. Install dependencies with [npm](https://www.npmjs.com/): `npm install`

4. Run extension in new chrome instance: `npm run start:chrome`

5. This will open a new chrome window and will have the extension pre-installed for you to test. Any changes made to the source code will be re-compiled and updated on the extension.

## Create Production Build
1. Clone the repository, navigate to it and install dependencies as steps 1-3 above.

2. Start a production build: `npm run build`

3. A folder named `extension` with the production build files will be created.

4. Distribute this folder unpacked or compress to a .zip file and distribute.

