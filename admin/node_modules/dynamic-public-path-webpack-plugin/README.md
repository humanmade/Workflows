# dynamic-public-path-webpack-plugin
Allows you to use a global, client side variable to set publicPath 
instead of the string arbitrarily set in options.publicPath. 
Very useful when working with CDNs.

Works with Webpack 2 and 1.

### Installation
``` sh
npm i dynamic-public-path-webpack-plugin --save-dev
```

### Usage

#### 1. Simple use
webpack.conf.js:

``` javascript
const DynamicPublicPathPlugin = require("dynamic-public-path-webpack-plugin");

module.exports = {
    entry: {
        app: ['./main.js'],
    },
    output: {
        filename: '[name].js',
        path: '.dist/',
        publicPath: 'http://publicPath.com' // Mandatory!
    },
    plugins: [
        new DynamicPublicPathPlugin({
            externalGlobal: 'window.cdnPathFromBackend', //Your global variable name.
            chunkName: 'app' // Chunk name from "entry".
        })
    ]
}
```

**Important!** 
Use distinctive strings as `output.publicPath`. 
It functions as a placeholder, and if it collides with other strings in
your files, the plugin will break your code.

#### 2. Multiple chunks
Just add more DynamicPublicPathPlugin instances to plugins Array:

``` javascript
    plugins: [
        new DynamicPublicPathPlugin({
            externalGlobal: 'window.cdnPathFromBackend',
            chunkName: 'app'
        }),
        new DynamicPublicPathPlugin({
            externalGlobal: 'window.otherCdnPathFromBackend',
            chunkName: 'admin'
        })
    ]
```


#### 3. Using with CommonsChunkPlugin
Pass the manifest chunk name to the plugin:
``` javascript
const DynamicPublicPathPlugin = require("dynamic-public-path-webpack-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
    entry: {
        app: ['./js/main.js'],
        vendor: ['moment', 'react', 'react-dom', 'react-router']
    },
    output: {
        filename: '[name].js',
        path: './dist/',
        publicPath: 'http://publicPath.com'
    },
    plugins: [
        new CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        }),
        new DynamicPublicPathPlugin({
            externalGlobal: 'window.otherCrazyPath', 
            chunkName: 'manifest'
        })
    ]
}
```
