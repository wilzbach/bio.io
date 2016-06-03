var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: 'dist/msa.js'
    },
    module: {
        loaders: [
            {   test: path.join(__dirname, 'src'),
                loader: 'babel-loader'
            }
        ],
    },
    devtool: 'source-map',
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        }),
    ],
};
var w = module.exports;
