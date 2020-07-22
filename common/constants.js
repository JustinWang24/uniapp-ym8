/**
 * 可能需要广泛使用的一些常量
 */
export default {
	VERSION: '1.0',
	AJAX_SUCCESS: 100,
	AJAX_ERROR: 99,
	PAGE_SIZE: 10,
	FAKE_UUID:'fake',
	MAX_FILE_UPLOADS_COUNT: 1,
	BASE_URL: 'http://yiminbar.test',
	API: {
		USER:{
			LOGIN:'/api/profile/login',
			SIGN_UP:'/api/profile/sign-up',
			SAVE_PROFILE:'/api/user/save-profile',
			GET_PROFILE:'/api/profile/get',
			UPDATE_PASSWORD:'/api/user/update-password',
			GET_NOTIFICATIONS:'/api/user/get-notifications',
			GET_NEW_NOTIFICATIONS:'/api/user/get-new-notifications',
			GET_OLD_NOTIFICATIONS:'/api/user/get-old-notifications',
			UPLOAD_PROFILE:'/api/profile/update',
			LOAD_MY_PRODUCTS:'/api/products/load',
			LOAD_PRODUCT:'/api/products/view-product',
			DELETED_PRODUCT:'/api/products/delete-product',
			SAVE_MY_PRODUCT:'/api/products/save',
			UPLOAD_PRODUCT_IMAGE:'/api/products/upload-image',
		},
		WYSIWYG: {
			LOAD_SHORTCODE:'/api/wysiwyg/shortcode/load',
			UPLOAD_FILE:'/api/wysiwyg/files/upload?api_token=',
			LOAD_FILES:'/api/wysiwyg/files/view?api_token=',
			UPLOAD_IMAGE:'/api/wysiwyg/images/upload?api_token=',
			LOAD_IMAGES:'/api/wysiwyg/images/view?api_token=',
		},
		BUSINESS: {
			QUERY: '/business-query',
		},
		TOPIC:{
			SUBMIT:'/api/topics/submit-topic',
			SUBMIT_COMMENT:'submit-comment', // 可匿名评论，所以没有带api
			THUMB_UP_COMMENT:'/api/topics/thumb-up',
			WATCH_USER:'/api/topics/watch-user',
			WATCH_TOPIC:'/api/topics/watch-topic',
			MY_TOPICS:'/api/topics/my-topics',
		},
		TAGS:{
			GET_ALL:'/api/trends/get-tags',
			GET_BY_TAG_NAME:'/api/trends/get-by-tag-name',
		},
		NEWS:{
			SEARCH:'/api/trends/search-news',
			LOAD_CONTENT:'/api/trends/load-content',
			SUBMIT_COMMENT:'/api/trends/submit-comment',
		}
	},
	PAGE:{
		HOME_DETAIL: '/pages/home-detail/home-detail?params=', // 查看文章的内容的页面
		HOME_PERSON: '/pages/home-person/home-person?params=', // 查看别人的资料的页面
		HOME_PROFILE: '/pages/home-profile/home-profile', // 用户自己的资料页面
		HOME_SHOP: '/pages/home-products/home-products', //  用户的产品列表
		MANAGE_PRODUCT: '/pages/manage-product/manage-product?params=', // 管理产品页面
		VIEW_PRODUCT: '/pages/view-product/view-product?params=', // 浏览产品的详情页面
	}
}