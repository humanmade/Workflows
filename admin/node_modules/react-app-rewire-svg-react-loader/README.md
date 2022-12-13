# Archive Notice

This project is archived. Create React App v2 introduced [support for SVG Components](https://facebook.github.io/create-react-app/docs/adding-images-fonts-and-files#adding-svgs). We recommend using the native support for SVG Components instead of this project.

# react-app-rewire-svg-react-loader

Add [SVG React Loader](https://github.com/jhamlet/svg-react-loader) to your [create-react-app](https://github.com/facebookincubator/create-react-app) via [react-app-rewired](https://github.com/timarney/react-app-rewired).

## Installation

This package is not yet published to the npm registry. Install from GitHub:

```
yarn add --dev codebandits/react-app-rewire-svg-react-loader
```

OR

```
npm install --save-dev codebandits/react-app-rewire-svg-react-loader
```

## Usage

Import your `*.svg` files and use them as React components.

### Example

In your react-app-rewired configuration:

```javascript
/* config-overrides.js */

const rewireSvgReactLoader = require('react-app-rewire-svg-react-loader');

module.exports = function override(config, env) {
    // ...
    config = rewireSvgReactLoader(config, env);
    // ...
    return config;
}
```

In your React application:

```svg
<!-- src/triangle.svg -->

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <polygon points="0,93.3 93.3,93.3 50,6.7"/>
</svg>
```

```jsx harmony
// src/App.js

import React from 'react';
import Triangle from './triangle.svg';

export default () => (
    <div>look, it's a triangle: <Triangle/></div>
)
```
