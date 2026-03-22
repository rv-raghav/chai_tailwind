# ChaiCSS

ChaiCSS is a tiny utility-first CSS runtime that scans `chai-*` classes in the browser and generates matching CSS rules on the fly.

## Install

```bash
npm install @atomic2103/chaicode-css
```

## Usage

### ESM

```js
import ChaiCSS from "@atomic2103/chaicode-css";

ChaiCSS.refresh();
```

### CommonJS

```js
const ChaiCSS = require("@atomic2103/chaicode-css");

ChaiCSS.refresh();
```

### Browser script tag

```html
<script src="https://unpkg.com/@atomic2103/chaicode-css/dist/chai-css.js"></script>
<script>
  ChaiCSS.refresh();
</script>
```

## API

- `ChaiCSS.refresh(root?)`: scans the document or a subtree for `chai-*` classes and injects runtime CSS.
- `ChaiCSS.theme`: exposes the current color, type, spacing-related tokens, shadows, and radii.
- `ChaiCSS.referenceGroups`: lightweight grouped examples used by the demo site.
- `ChaiCSS.getCssText()`: returns the generated CSS text currently held by the runtime.

## Included Files

The published package only ships the runtime bundle and package docs.

```json
"files": ["dist", "README.md"]
```

That means the landing page demo files in this repo are kept out of the npm tarball.

## Publish Checklist

1. Make sure your npm token has package write access, or publish with `npm login` plus OTP.
2. Fill in any final metadata you want, such as author, repository, homepage, and your preferred license.
3. If you want the package to be open source, replace `UNLICENSED` with your actual license and add a `LICENSE` file.
4. Run `npm run check`.
5. Run `npm run pack:dry`.
6. Publish with `npm run publish:public`.

## Local Demo

This repo still includes a showcase landing page. Open `index.html` locally to test the runtime and playground in the browser.
