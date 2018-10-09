// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "autoprefixer": {},
    "postcss-adaptive": {
      remUnit: 75,
      baseDpr: 2,
      remPrecision: 6,
      hairlineClass: 'hairlines',
      autoRem: true,
    }
  }
}