# SMART-TBI Post Interpretation Aids

The post interpretation aid is designed to help you better interpret social cues, including the meaning and sentiment of a Facebook post. If you have challenges “reading” other people, or understanding social cues, this aid can help by giving details about the emotions in a post, and showing images to help you understand the emotions in the message.

## Setup for Development

1. Clone GitHub repository: `git clone https://github.com/smart-tbi/smart-tbi`

2. Navigate to Directory: `cd interpretation`

3. Install dependencies with [npm](https://www.npmjs.com/): `npm install`

4. Run extension in new chrome instance: `npm run start:chrome`

5. This will open a new chrome window and will have the extension pre-installed for you to test. Any changes made to the source code will be re-compiled and updated on the extension.

## Create Production Build
1. Clone the repository, navigate to it and install dependencies as steps 1-3 above.

2. Replace `src/manifest.json` with `src/manifest.production.json`.

3. Start a production build: `npm run build`

4. A folder named `extension` with the production build files will be created.

5. Distribute this folder unpacked or compress to a .zip file and distribute.

## Facebook Post UI Structure
1. Post elements have a `data-pagelet` attribute that starts with `FeedUnit` or `role="article"` attribute. In most situations, the posts are enclosed by a `div` with `role="feed"` and we can use the same to filter out the true posts.

2. The text inside each post is scraped using the `text-align` style attribute. However, when doing we smoe times also scrape the first comment. To filter out the comments from the post text, we check the parent div of the text and see if it contains an `aria-label` attribute that mentions `comment`.

3. To find the See More button inside the Post, we search for a div with `role="button"` attribute and we further seach for the `innerText` property to be `"See More"`

