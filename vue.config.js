/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';
const resolve = (dir) => path.join(__dirname, dir);
const AMapToken = 'c5f257d7246388f7356a60875801a855'
const assetsCDN = {
  externals: {
    AMap: 'AMap',
  },
  js: [
    `https://webapi.amap.com/maps?v=2.0&plugin=AMap.PlaceSearch,AMap.GeoJSON&key=${AMapToken}`,
  ]
};

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: './',
  outputDir: 'amap-search',
  configureWebpack: {
    externals: assetsCDN.externals
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      const customArgs = args;
      customArgs[0].title = '搜索';
      return customArgs;
    });
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@img', resolve('src/assets/images'));
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        const customOptions = options;
        customOptions.compilerOptions.preserveWhitespace = true;
        return customOptions;
      })
      .end();
      config.module
        .rule('svg')
        .uses.clear()
      config.module
        .rule('svg')
        .use('vue-svg-loader')
        .loader('vue-svg-loader')
    config.when(!isProd, (options) => options.devtool('cheap-source-map'));
    config.when(isProd, (options) => {
      options.optimization.minimizer('terser').tap((args) => {
        const customArgs = args;
        customArgs[0].terserOptions.compress.drop_console = true;
        customArgs[0].terserOptions.compress.drop_debugger = true;
        customArgs[0].terserOptions.compress.warnings = false;
        return customArgs;
      });
      options.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          },
        }
      });
      options.optimization.runtimeChunk('single');
    });
    config.plugin('html').tap((args) => {
      args[0].cdn = assetsCDN;
      return args;
    });
  },
  devServer: {
    open: false,
    https: false,
    progress: true
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'com.amapsearch', //包名,程序的唯一标识符
        productName: 'amapSearch', // 项目名，也是生成的安装文件名，即wyDemo.exe
        copyright: 'Dzxwind Copyright © 2021', // 版权信息
        files: ['./**/*'],
        win: {
          // win相关配置
          requestedExecutionLevel: 'requireAdministrator', //获取管理员权限
          target: [
            {
              target: 'nsis', // 利用nsis制作安装程序
              arch: [
                // 这个意思是打出来32 bit + 64 bit的包，但是这样打包出来的安装包体积比较大
                'x64', // 64位
                'ia32',
              ],
            },
          ],
        },
        mac: {
          target: [
            'dmg',
            'zip'
          ]
        },
        nsis: {
          oneClick: false, // 是否一键安装
          allowElevation: true, // 允许请求提升。 如果为false，则用户必须使用提升的权限重新启动安装程序。
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          shortcutName: 'amapSearch', // 图标名称(项目名称)
        },
      },
    },
  },
};
