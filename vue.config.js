// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const devServerPort = 9527; // TODO: get this variable from setting.ts
// const mockServerPort = 9528 // TODO: get this variable from setting.ts
const name = "秸秆禁烧区域监控大屏"; // TODO: get this variable from setting.ts

module.exports = {
  transpileDependencies: process.env.NODE_ENV === "development" ? ["*"] : ["*"],

  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
    // progress: false,
    // proxy: {
    //   // change xxx-api/login => /mock-api/v1/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `http://localhost:${mockServerPort}/mock-api/v1`,
    //     changeOrigin: true, // needed for virtual hosted sites
    //     ws: true, // proxy websockets
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // }
  },
  // pwa: {
  //   name: name,
  //   workboxPluginMode: 'InjectManifest',
  //   workboxOptions: {
  //     swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
  //   }
  // },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        path.resolve(__dirname, "src/styles/_variables.scss"),
        path.resolve(__dirname, "src/styles/_mixins.scss")
      ]
    }
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.entry.app = ["babel-polyfill", "./src/main.ts"];

    config.set("name", name);
    // config.entry.app = ['babel-polyfill', './src/main.ts']

    // https://webpack.js.org/configuration/devtool/#development
    // Change development env source map if you want.
    // The default in vue-cli is 'eval-cheap-module-source-map'.
    // config
    //   .when(process.env.NODE_ENV === 'development',
    //     config => config.devtool('eval-cheap-source-map')
    //   )

    config.when(process.env.NODE_ENV !== "development", config => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: path.resolve(__dirname, "src/components"),
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
