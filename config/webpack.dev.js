const merge = require('webpack-merge');
const common = require('./webpack.common');

const NodemonPlugin = require( 'nodemon-webpack-plugin' )

module.exports = merge(common, {
    watch: true,
    plugins: [
        new NodemonPlugin(),
    ],
});