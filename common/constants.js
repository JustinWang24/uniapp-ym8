/**
 * 可能需要广泛使用的一些常量
 */
export default {
	VERSION: '1.0',
	AJAX_SUCCESS: 100,
	AJAX_ERROR: 99,
	PAGE_SIZE: 10,
	FAKE_UUID:'fake',
	API: {
		USER:{
			LOGIN:'/login',
			SAVE_PROFILE:'/api/user/save-profile',
			UPDATE_PASSWORD:'/api/user/update-password',
			GET_NOTIFICATIONS:'/api/user/get-notifications',
			GET_NEW_NOTIFICATIONS:'/api/user/get-new-notifications',
			GET_OLD_NOTIFICATIONS:'/api/user/get-old-notifications',
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
			SUBMIT:'/submit-topic',
			SUBMIT_COMMENT:'/submit-comment',
			THUMB_UP_COMMENT:'/thumb-up',
			WATCH_USER:'/watch-user',
			WATCH_TOPIC:'/watch-topic',
		},
		TAGS:{
			GET_ALL:'/api/trends/get-tags',
			GET_BY_TAG_NAME:'/api/trends/get-by-tag-name',
		},
		NEWS:{
			SEARCH:'/api/trends/search-news'
		}
	},
}