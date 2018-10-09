/**
 * 获取随机数
 * @param  {Number}  len 获取的随机数多少位
 * @param  {Beabool} firstChar 随机数第一个字符是否可以为0
 * @return {String}   返回n位的随机数
 */
export function getRandom(len = 18, firstChar = false) {
  let random = Math.random().toFixed(len);
  random = random.substring(2);
  if (!firstChar) {
    let reg = /^0/;
    if (reg.test(random)) {
      let fChar = (Math.random() * 8 + 1).toFixed();
      random = random.replace(reg, fChar);
    }
  }
  return random;
}

// refers: https://www.sitepoint.com/get-url-parameters-with-javascript/
export function getUrlParams(url) {
  const d = decodeURIComponent;
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  const obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0]; // eslint-disable-line
    const arr = queryString.split('&');
    for (let i = 0; i < arr.length; i += 1) {
      const a = arr[i].split('=');
      let paramNum;
      const paramName = a[0].replace(/\[\d*\]/, (v) => {
        paramNum = v.slice(1, -1);
        return '';
      });
      const paramValue = typeof(a[1]) === 'undefined' ? true : a[1];
      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = d([obj[paramName]]);
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(d(paramValue));
        } else {
          obj[paramName][paramNum] = d(paramValue);
        }
      } else {
        obj[paramName] = d(paramValue);
      }
    }
  }
  return obj;
}
