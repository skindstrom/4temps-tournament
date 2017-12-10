const path = require('path');
/*
Used to remove warning:
WARNING in ./node_modules/express/lib/view.js
81:13-25 Critical dependency: the request of a dependency is an expression
*/
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.js',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'lib')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
};
