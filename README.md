# **aniforprez**.dev

## Developing the website

### Requirements

This site uses [zola](https://www.getzola.org/). Follow the [instructions](https://www.getzola.org/documentation/getting-started/installation/)
for installing it to your platform of choice and run `zola serve` for the site to be served by default at
`127.0.0.1:1111`

This site also uses tailwind which requires npm and node. Install node and npm through your process of choice. I prefer
asdf to manage node and, consequently, npm.

To serve the CSS files for development with Tailwind's JIT, run `npm run dev`. To build the CSS files for production,
run `npm run build`
