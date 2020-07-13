import $store from '../store/index.js';

export default {
	// 全局配置
	common:{
		// #ifndef H5
		// baseUrl:"https://ym8.com.au/api/",
		baseUrl:"http://yiminbar.test",
		// #endif
		// #ifdef H5
		baseUrl:"http://yiminbar.test",
		// #endif
		header:{
			'Content-Type':'application/json;charset=UTF-8',
			'Authorization':'',
		},
		data:{},
		method:'GET',
		dataType:'json'
	},
	// 请求 返回promise
	request(options = {}){
		// 填入Authentication信息, 为用户的uuid
		this.common.header['Authorization'] = $store.state.userProfile.uuid !== undefined ? ('Bearer ' + $store.state.userProfile.uuid) : '';
		// 组织参数
		options.url = this.common.baseUrl + options.url
		options.header = options.header || this.common.header
		options.data = options.data || this.common.data
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		
		// token
		if (options.token) {
			// options.header.token = $store.state.user.token
			// options.header.token = $store.state.currentUser.uuid !== undefined ? $store.state.currentUser.uuid : '';
			// 二次验证
			if (this.common.header['Authorization'] === '') {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				});
				return uni.navigateTo({
					url: '/pages/tabbar/my/my.vue'
				});
			}
		}
		
		// 请求
		return new Promise((res,rej)=>{
			// 请求之前... todo
			// 请求中...
			uni.request({
				...options,
				success: (result) => {
					// 返回原始数据
					if(options.native){
						return res(result)
					}
					// 服务端失败
					if(result.statusCode !== 200){
						if (options.toast !== false) {
							uni.showToast({
								title: result.data.msg || '服务端失败',
								icon: 'none'
							});
						}
						return rej(result.data) 
					}
					// 成功
					res(result.data)
				},
				fail: (error) => {
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					return rej()
				}
			});
		})
	},
	// get请求
	get(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	// post请求
	post(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	// delete请求
	del(url,data = {},options = {}){
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},
}