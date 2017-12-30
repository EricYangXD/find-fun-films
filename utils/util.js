function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

function http(url, callBack) {
  douban_limit();
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data);
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  console.log(castsjoin)
  return castsjoin.substring(0, castsjoin.length - 2);
}

function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}
//豆瓣接口调用频率限制
function douban_limit() {
  var timestamp = Date.parse(new Date());
  var requestDoubanTime = wx.getStorageSync('requestDoubanTime');
  var requestDoubanNum = wx.getStorageSync('requestDoubanNum');
  if (requestDoubanTime && timestamp - requestDoubanTime < 60000) {
    wx.setStorageSync('requestDoubanNum', requestDoubanNum += 1);
    if (requestDoubanNum < 35) {
      //Lower than 35/m,pass            
      return false;
    }else {
      wx.showToast({
        title: '豆瓣api请求频率超35/m，小心',
        icon: 'loading',
        duration: 5000
      });
      //提示或者去别的地方
      // 再次更新，wx.redirectTo的路径问题非常奇怪，不能使用绝对路径，会报错。
      // 使用相对路径，由于util会在不同的地方调用 ，导致我的页面没法跳转，而且不报错
      // 不让使用绝对路径，怎么办呢
      // 找到了这么一个办法，可以在相对路径前，加n个"../"，多少个都不会报错，
      // 而且可以正确跳转
      // 考虑到一般路径不会特别深，那么5个"../"可以保证绝对路径
      wx.redirectTo({
           url:"../../../../pages/login/login"
      });
    }
  }
  else {
    wx.setStorageSync('requestDoubanTime', timestamp);
    wx.setStorageSync('requestDoubanNum', 1);
  }
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString:convertToCastString,
  convertToCastInfos:convertToCastInfos
}