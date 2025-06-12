module.exports = function override(config) {
  config.ignoreWarnings = [
    {
      module: /node_modules\/react-datepicker/,
      message: /Failed to parse source map/,
    },
  ];
  return config;
};