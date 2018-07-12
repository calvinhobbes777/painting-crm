const rewireLess = require("react-app-rewire-less");
const { injectBabelPlugin } = require("react-app-rewired");

module.exports = function override(config, env) {
  config = injectBabelPlugin(["import", { libraryName: "antd", style: true }], config);

  config = rewireLess.withLoaderOptions({
    modifyVars: {}
  })(config, env);

  config.resolve.modules.push("./src");

  return config;
};
