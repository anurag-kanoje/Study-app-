module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@contexts': './src/contexts',
            '@types': './src/types',
            '@lib': './src/lib',
            '@services': './src/services',
          },
        },
      ],
    ],
  };
}; 