'use strict';

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import packageJSON from './package.json';
import { StatsWriterPlugin } from "webpack-stats-plugin";

const production = process.env.NODE_ENV === 'production';
const nodeEnv = production ? 'production' : 'development';

const keys = Object.keys;

console.log(`Mode: \u001b[3${production ? '1' : '3'}m${nodeEnv}\u001b[0m`);

const buildPath = path.resolve(__dirname, `./build/${nodeEnv}/client`);
const sourcePath = path.resolve(__dirname, './source');
const modulesPath = path.resolve(__dirname, './node_modules');

const stats = {

    hash: false,
    timings: true,
    publicPath: false,

    assets: true,
    children: false,
    chunks: false,
    modules: false,
    source: false,
    version: false,

    reasons: !production,
    warnings: true,
    errors: true,
    errorDetails: !production,

    colors: { green: '\u001b[32m' }

};

const entry = {
    'frameworks': ['lodash', 'whatwg-fetch', 'react', 'react-dom', 'react-router', 'redux', 'react-redux'],
    'app': './client/app'
}

const plugins = [

    new webpack.NoEmitOnErrorsPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
        name: 'frameworks',
        chunks: ['app'],
        filename: `[name]${production ? '-[hash]' : ''}.js`
    }),

    new webpack.DefinePlugin({
        __BUILD__: Date.now(),
        __DEVELOPMENT__: !production,
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),

    new webpack.NamedModulesPlugin(),

    new ExtractTextPlugin(`styles${production ? '-[contenthash]' : ''}.css`),

    new AssetsPlugin({
        path: path.join(buildPath, '/assets'),
        filename: `${nodeEnv}-assets.json`,
        fullPath: false,
        metadata: {
            buildPath
        }
    }),

    new StatsWriterPlugin({
        transform: function (data, opts) {
            data.BUILD_HASH = opts.compiler.hash;
            data.BUILD_VERSION = packageJSON.version;
            return JSON.stringify(data, null, 2);
        }
    }),

    /**
     * Build index.html
     */
    {
        apply(compiler){

            compiler.plugin('after-emit', (compilation, callback) => {
                let assets = require(path.join(buildPath, `/assets/${nodeEnv}-assets.json`));
                let index = fs
                    .readFileSync( path.join(sourcePath, '/client/index.html'), {encoding: 'utf8'} )
                    .replace(RegExp(`(<!--#)?\\s*(${nodeEnv}|common)\\s*(#-->)?`, 'ig'), '')
                    .replace(RegExp(`<!--#\\s*(development|production).*(development|production)\\s*#-->`, 'ig'), '')
                    .replace('\n', '')
                    .replace(/>\s*</ig, '><')
                    .replace(/(<\!DOCTYPE[^>]+>)/, '$1\n');
                keys(assets).forEach(
                    asset => keys(assets[asset]).forEach(
                        ext => (index = index.replace(`${asset}.${ext}`, assets[asset][ext]))
                    )
                )
                // compilation.assets['index.html'] = { source: () => index, size: () => index.length };
                fs.writeFileSync(path.join(buildPath, `/index.html`), index);
                fs.createReadStream(
                    path.join(sourcePath, '/client/assets/favicon.png')
                ).pipe(fs.createWriteStream(
                    path.join(buildPath, `/favicon.png`))
                )

                fs.createReadStream(
                    path.join(sourcePath, '/client/404.html')
                ).pipe(fs.createWriteStream(
                    path.join(buildPath, `/404.html`))
                )

                callback()
            })
        }
    }

];

if (production) {
    plugins.push(

        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            mangle: {
                except: ['$super', '$', 'exports', 'require']
            },
            output: { comments: false },
        }),

        /**
         * Clean build directory
         */
        {
            apply(compiler){
                compiler.plugin('emit', (compilation, callback) => {

                    console.log(`clean previous build at \u001b[33m${buildPath}\u001b[0m :`);

                    let excluded = [
                        '.git',
                        '.gitignore',
                        'LICENSE',
                        'README.md'
                    ].reduce((hash, name) => ({...hash, [name]:1}), {})

                    fs.readdirSync(buildPath)
                    .filter(name => !(name in excluded))
                    .forEach(name => fs.stat(
                        path.join(buildPath, `/${name}`),
                        (err, stat) => {
                            if(!err && stat && stat.isFile()) {
                                console.log(`\t\u001b[31m${name}\u001b[0m`);
                                fs.unlinkSync(path.join(buildPath, `/${name}`))
                            }
                        }
                    ))

                    callback()
                })
            }
        }

    );
} else {

    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );

}

process.traceDeprecation = true

const config = {

    plugins,
    entry,
    stats,

    context: sourcePath,
    // progress: true,
    devtool: (production ? undefined : 'source-map'),

    output: {
        filename: `[name]${production ? '-[hash]': ''}.js`,
        library: (production ? undefined : '[name]'),
        path: buildPath,
        publicPath: '/'
    },


    module: {
        loaders: [{

            test: /\.s?css$/,
            exclude: /node_modules/,
            loader: (
                production ?
                    ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader?modules&importLoaders=1&localIdentName=[local]_[hash:base64:5]&camelCase!sass-loader?modules'
                    })
                : 'style!css?modules&importLoaders=1&localIdentName=[local]_[hash:base64:5]&camelCase!sass?modules'
            )

        },{

            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            include: sourcePath,
            loader: 'react-hot'

        },{

            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            include: sourcePath,
            loader: `babel-loader${[
                '?plugins[]=transform-class-properties',
                ',plugins[]=transform-decorators-legacy',
                ',presets[]=react',
                ',presets[]=es2015',
                ',presets[]=stage-0'
            ].join('')}`
            // ,
            // options:{
            //     plugins: [ 'transform-class-properties', 'transform-decorators-legacy' ],
            //     presets: [ 'react', 'es2015', 'stage-0' ]
            // }

        },{

            test: /\.(html|svg|ttf|woff|woff2|xml|jpg|jpeg|png|gif|bmp|ico|eot|txt|pdf|doc|docx|rtf)$/,
            exclude: /node_modules/,
            loader: 'file-loader',
            query: { name: 'assets/[name].[ext]' }

        }]
    },

    resolve: {
        extensions: ['.js', '.jsx', 'json', '.css', '.scss', '.sass' ],
        modules: [ sourcePath, modulesPath ]
    },

    resolveLoader: {
        extensions: ['.js', '.webpack-loader.js', '.web-loader.js', '.loader.js' ],
        moduleExtensions: ['-loader', '-loaders']
    },

    devServer: {
        contentBase: buildPath,
        historyApiFallback: true,
        host: '0.0.0.0',
        port: production ? 8088 : 8080,
        compress: production,
        inline: !production,
        hot: !production,
        stats
    }

};

// console.log(config.devServer)

export default config
