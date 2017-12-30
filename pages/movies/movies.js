var util = require('../../utils/util.js');
var app = getApp();
Page({
  // RESTFul API JSON
  // SOAP XML
  //粒度 不是 力度
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
  },
    onShareAppMessage: function () {
    return {
      title: '光与影',
      desc: '进入搜索电影吧',
      path: '/pages/movies/movies'
    }
  },
  onLoad: function (event) {
    //拼接豆瓣接口地址
    var inTheatersUrl = app.globalData.doubanBase +
      "/v2/movie/in_theaters" + "?start=0&count=6";
    var comingSoonUrl = app.globalData.doubanBase +
      "/v2/movie/coming_soon" + "?start=0&count=6";
    var top250Url = app.globalData.doubanBase +
      "/v2/movie/top250" + "?start=0&count=6";
    //获取电影列表数据
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },
  //点击“更多”
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },
  //点击电影
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "movie-detail/movie-detail?id="+movieId
    })
  },
  //获取数据
  getMovieListData: function (url, settedKey, categoryTitle) {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        //获取具体数据
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function (error) {
        // fail
        console.log(error);
      }
    })
  },

  onCancelImgTap: function (event) {
      this.setData({
        containerShow: true,
        searchPanelShow: false,
        searchResult:{}
      }
    )
  },

  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    })
  },

  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },
  //获取具体数据，并拼装
  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      //电影标题最多显示6个字符
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // 定义拼装数据格式，[1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      // console.info("temp",temp);
      movies.push(temp);
    }
    //设置为传入的对象名
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
    //打印接口返回数据
    console.info(settedKey,readyData);
    // debugger;
    wx.hideNavigationBarLoading();
  }
})