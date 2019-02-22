import wepy from 'wepy'

// 服务器接口地址
const host = 'http://laravelbbs.test/api'

// 普通请求 (封装请求方法,使用箭头函数来定义方法)
const request = async (options, showLoading = true) => {
	// 简化开发，如果传入字符串则转换成 对象
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }

	// 显示加载中(默认在请求之前显示加载中)
  if (showLoading) {
    wepy.showLoading({'title': '加载中'})
  }

	// 拼接请求地址
  options.url = host + '/' + options.url

	// 调用小程序的 request 方法
	/* 发起网络请求，参数主要包括：
		url——接口地址；
		data——请求的参数；
		header——请求的 header；
		method——请求的方法，有效值：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT。
	*/
  let response = await wepy.request(options)

  if (showLoading) {
		// 隐藏加载中
    wepy.hideLoading()
  }

	// 服务器异常后给与提示
  if (response.statusCode === 500) {
		// 显示一个模态框
    wepy.showModel({
      title: '提示',
      content: '服务器错误，请联系管理员或重试'
    })
  }
  return response
}

// 登录(封装登录方法,使用箭头函数来定义方法)
const login = async (params = {}) => {
	// code 只能使用一次，所以每次单独调用
  let loginData = await wepy.login()

	// 参数中增加code
  params.code = loginData.code

	// 接口请求 weapp/authorizations
  let authResponse = await request({
    url: 'weapp/authorizations',
    data: params,
    method: 'POST'
  })

	// 登录成功，记录 token 信息 (将 access_token 和过期时间存入 storage 中)
  if (authResponse.statusCode === 201) {
		// 设置缓存中的某个数据
    wepy.setStorageSync('access_token', authResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
  }

  return authResponse
}

/*
 * 抛出了定义的这两个方法，这样只需要 import api from '@/utils/api' 引入 api.js 文件后，
 * 就可以通过 api.request 和 api.login 来调用方法了
*/
export default {
  request,
  login
}
