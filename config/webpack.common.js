const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/app/index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../public-build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
                }),
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                }
            },
        ],
    },
    plugins: [
        new ExtractTextPlugin({
            filename: 'app.css',
            allChunks: true
        }),
    ]
};
