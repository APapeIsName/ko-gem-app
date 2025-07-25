module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        // 1. Tamagui 플러그인 설정
        ["@tamagui/babel-plugin", {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
          logTimings: true,
        }],
  
        // 2. Reanimated 플러그인 설정 (항상 마지막에 위치해야 함)
        'react-native-reanimated/plugin',
      ],
    };
  };