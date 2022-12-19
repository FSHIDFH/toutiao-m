module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      // 我们的设计稿是750宽度的，所以基准值是75；
      // vant组件库设计稿是375，所以基准值得是37.5
      rootValue: function ({ file }) {
        if (/vant/i.test(file)) return 37.5
        return 75
      },
      propList: ['*']
    }
  }
}
