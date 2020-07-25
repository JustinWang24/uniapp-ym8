import Constants from './constants.js';
import request from './request.js';

export default {
	getBaseUrl: function(){
		return Constants.BASE_URL;
	},
	// 根据指定的给定的tag获取列表项
	getTagItems: function(tag, options){
		return request.get(Constants.API.TAGS.GET_BY_TAG_NAME, {name: tag}, options);
	},
	// 获取Tags, 用于顶部的滑动频道列表
	getTags: function(data, options){
		if(this.isEmpty(data)){
			data = {};
		}
		if(this.isEmpty(options)){
			options = {};
		}
		return request.get(Constants.API.TAGS.GET_ALL, data, options);
	},
	// 获取某个tag的下一个分页的数据
	/**
	 * @param String type: 类型，是表示底部 bottom 还是顶部 top
	 * @param Object tag
	 * @param Number pageIndex
	 * @param Number|undefined firstId: 如果是顶部的刷新，才有实际意义，表示当前的第一个Item的id值。否则为 -1
	 */
	loadMoreByTag: function(type, tag, pageIndex, firstId){
		if(this.isEmpty(firstId)){
			firstId = -1;
		}
		return request.post(
			Constants.API.TAGS.GET_BY_TAG_NAME, 
			{tag:tag, pageIndex: pageIndex, firstId:firstId, type:type}, 
			{},
		);
	},
	// 根据关键字搜索
	searchByKeyword: function(keyword){
		return request.get(
			Constants.API.NEWS.SEARCH, 
			{q:keyword}, 
			{},
		);
	},
	// 获取用户的数据
	getUserProfile: function(id){
		return request.get(
			Constants.API.USER.GET_PROFILE, 
			{id:id}, 
			{},
		);
	},
	// 用户登录的操作
	login: function(username, password){
		return request.post(
			Constants.API.USER.LOGIN, 
			{email: username, password: password},
			{},
		);
	},
	// 用户注册
	/**
	 * @param {Object} form
	 */
	signUp: function(form){
		return request.post(
			Constants.API.USER.SIGN_UP, 
			form,
			{},
		);
	},
	// 加载文章或话题的文字内容
	getContentById: function(id, type){
		return request.get(
			Constants.API.NEWS.LOAD_CONTENT, 
			{id:id, type: type}, 
			{},
		);
	},
	// 发表评论
	/**
	 * @param {Object} comemnt
	 * @param {Object} target : 新闻或吐槽的ID
	 * @param {Object} type : 新闻还是吐槽
	 */
	submitComment:function(comment, target, type){
		return request.post(
			Constants.API.NEWS.SUBMIT_COMMENT,
			{comment: comment, type: type, target:target},
			{}
		)
	},
	thumbUpTopic: function(topicUuid){
		return request.post(
			Constants.API.TOPIC.THUMB_UP_COMMENT,
			{id: topicUuid, type: 'topic'},
			{}
		)
	},
	watchTopic: function(topicUuid){
		return request.post(
			Constants.API.TOPIC.WATCH_TOPIC,
			{id: topicUuid, type: 'topic'},
			{}
		)
	},
	// 单独关注某人
	watchUser: function(userUuid){
		return request.post(
			Constants.API.USER.WATCH_USER,
			{id: userUuid},
			{}
		)
	},
	myTopics: function(pageIndex,fIndex){
		return request.get(
			Constants.API.TOPIC.MY_TOPICS,
			{index: pageIndex, index_f: fIndex},
			{}
		)
	},
	// 加载话题的详情用来编辑
	loadTopicByUuidToEdit: function(topicUuid, userUuid){
		return request.get(
			Constants.API.TOPIC.LOAD,
			{topicUuid: topicUuid, userUuid: userUuid},
			{}
		)
	},
	// 提交吐槽话题
	submitTopic: function(topic,userUuid, images){
		return request.post(
			Constants.API.TOPIC.SUBMIT,
			{topic: topic, userUuid: userUuid, images: images},
			{}
		)
	},
	// 用户获取自己的创建的所有文章
	topicsICreated: function(userId){
		return request.get(
			Constants.API.TOPIC.TOPICS_I_CREATED,
			{userId: userId},
			{}
		)
	},
	// 将新闻或者话题展示详情时，通过这个方法来创建一个对象
	buildParamsForHomeDetailPageUrl: function(payload){
		const params = {
			id: payload.item.id,
			// picture: payload.item.picture,
			// traffic: payload.item.traffic,
			// trend: payload.item.trend,
			type: payload.type
		}
		return Constants.PAGE.HOME_DETAIL + JSON.stringify(params);
	},
	// 查看朋友的个人主页
	buildParamsForFriendDetailPageUrl: function(payload){
		const params = {
			id: payload.item.id,
			uuid: payload.item.uuid,
			picture: payload.item.picture,
			name: payload.item.name,
			type: 'person'
		}
		return Constants.PAGE.HOME_PERSON + JSON.stringify(params);
	},
	// 管理产品的页面
	buildParamsForManageProductPageUrl: function(productId){
		if(!productId){
			productId = 0; // 如果没有传，就表示是创建产品, 那么赋值为0
		}
		return Constants.PAGE.MANAGE_PRODUCT + JSON.stringify({id: productId});
	},
	// 查看产品详情的页面
	buildParamsForViewProductPageUrl: function(productId){
		if(!productId){
			return null; // 返回空, 无法跳转
		}
		return Constants.PAGE.VIEW_PRODUCT + JSON.stringify({id: productId});
	},
	// 查看自己的个人主页
	buildParamsForHomeProfilePageUrl: function(){
		return Constants.PAGE.HOME_PROFILE;
	},
	// 查看自己的所有吐槽记录
	buildParamsForMyTopicsPageUrl: function(){
		return Constants.PAGE.HOME_TOPICS;
	},
	// 撰写吐槽的页面
	buildParamsWriteTopicPageUrl: function(topicId){
		if(topicId){
			return Constants.PAGE.WRITE_TOPIC + '?params=' + JSON.stringify({id: topicId});
		}
		return Constants.PAGE.WRITE_TOPIC;
	},
	// 管理自己的商店
	buildParamsForHomeProductsPageUrl: function(){
		return Constants.PAGE.HOME_SHOP;
	},
	// 查看二手商店: 要传过来一个用户的id才行
	buildParamsForViewShopPageUrl: function(ownerUuid){
		return Constants.PAGE.VIEW_SHOP + JSON.stringify({ownerUuid: ownerUuid});
	},
	// 用户上传图片的url
	buildImageUploadUrl: function(){
		return this.getBaseUrl() + Constants.API.USER.UPLOAD_PROFILE;
	},
	// 用户上传产品图片的url
	buildProductImageUploadUrl: function(){
		return this.getBaseUrl() + Constants.API.USER.UPLOAD_PRODUCT_IMAGE;
	},
	// 用户上传Topic吐槽文章图片的url
	buildTopicImageUploadUrl: function(){
		return this.getBaseUrl() + Constants.API.USER.UPLOAD_TOPIC_IMAGE;
	},
	// 用户更新自己档案的
	updateMyProfile: function(profile){
		return request.post(
			Constants.API.USER.UPLOAD_PROFILE,
			profile,
			{}
		);
	},
	// 加载传入的用户为uuid的在售商品
	loadProductsByUserUuid: function(uuid, currentPageIndex){
		return request.post(
			Constants.API.USER.LOAD_MY_PRODUCTS,
			{uuid: uuid, index: currentPageIndex},
			{}
		);
	},
	// 用户保存产品
	saveProductByUserUuid: function(product, images, ownerUuid){
		return request.post(
			Constants.API.USER.SAVE_MY_PRODUCT,
			{product: product, ownerUuid: ownerUuid, images: images},
			{}
		);
	},
	// 加载产品的详情
	loadProductById: function(id){
		return request.get(
			Constants.API.USER.LOAD_PRODUCT,
			{id: id},
			{}
		);
	},
	// 删除产品
	deleteProductById: function(id,userUuid){
		return request.get(
			Constants.API.USER.DELETED_PRODUCT,
			{id: id, userUuid: userUuid},
			{}
		);
	},
	// 判断给定的字符串是否是一个需要上传的. blob是浏览器, http://tmp/ 是小程序和APP中的
	isLocalTempFileUrl: function(str){
		return str.indexOf('blob:') > -1 || str.indexOf('http://tmp/') > -1 || str.indexOf('file:') > -1;
	},
    /**
     * 根据 id 来定位数组中的 item
     * @param id
     * @param obj: Array
     * @returns {*}
     * @constructor
     */
    GetItemById: function (id, obj) {
        let result = null;
        if(Array.isArray(obj)){
            // 传入的是数组
            obj.forEach((item) => {
                if(id === item.id){
                    result = item;
                }
            });
        }
        else{
            // 传入的是对象
            const keys = Object.keys(obj);
            keys.forEach( key => {
                if(id === obj[key].id){
                    result = obj[key];
                }
            })
        }
        return result;
    },
    /**
     * 根据 id 来定位数组中的 item 的索引
     * @param id
     * @param obj
     * @returns {*}
     * @constructor
     */
    GetItemIndexById: function (id, obj) {
        let result = -1;
        if(Array.isArray(obj)){
            obj.forEach((item, idx) => {
                if(id === item.id){
                    result = idx;
                }
            });
        }
        else{
            const keys = Object.keys(obj);
            keys.forEach( key => {
                if(id === obj[key].id){
                    result = key;
                }
            })
        }
        return result;
    },
    /**
     * 数组换位
     * @param arr
     * @param index1
     * @param index2
     * @returns {*}
     */
    swapArray: function (arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    },
    GetItemIndexByUuid: function (uuid, obj) {
        let result = null;
        obj.forEach((item, idx) => {
            if(uuid === item.uuid){
                result = idx;
            }
        });
        return result;
    },
    // 检查是否 ajax 的 response 是一个成功的调用结果
    isAjaxResOk: function(res){
        return res.code === Constants.AJAX_SUCCESS;
    },
    // 在本环境中是否为空
    isEmpty: function (obj) {
        // null and undefined 等同于空
        if (obj === null) return true;
        if (obj === '') return true;
        if (typeof obj === 'undefined') return true;

        // 处理数组
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        // 是否传入的对象自己有属性
        if(typeof obj === 'object'){
            if(obj instanceof Date){
                // 日期类型, 则肯定不是空的
            }
            else{
                let anyProperty = 0;
                for (let key in obj) {
                    anyProperty++;
                    break;
                }
                return anyProperty === 0;
            }
        }
        return false;
    },
    // 验证日期格式
    checkData: function (str) {
        const a = /^(\d{4})-(\d{2})-(\d{2})$/
        if (!a.test(str)){
            return false
        } else {
            return true
        }
    },
    pageScrollTo: function(pos){
        // 移动到页面顶部
        document.body.scrollTop = document.documentElement.scrollTop = pos;
    },
    // isDevEnv: function(){
    //     return true;
    // },
	/**
	 * 方便的创建URL的方法
	 * @param {Object} uri
	 * @param {Object} params
	 */
  //   buildUrl: function(uri, params) {
  //       // 方便的创建 url, 可以自动判定是测试环境还是生产环境
  //       const base = this.isDevEnv() ? 'http://yiminbar.test/api/' : 'https://ym8.com.au/api/';
		// if(!this.isEmpty(params)){
		// 	const ret = [];
		//     for (let d in data){
		// 		ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
		// 	}
		// 	return base + uri + '?' + ret.join('&');
		// }
  //       return base + uri;
  //   },
    // 转换文件大小, 从整数到 text
    fileSize: function(sizeInt){
        let size = '';
        if(sizeInt < 1048576){
            size = (sizeInt/1024).toFixed(1) + 'K';
        }
        else{
            size = (sizeInt/1048576).toFixed(1) + 'M';
        }
        return size;
    },
    isImage: function (type) {
        return type === Constants.FILE_TYPE.IMAGE;
    },
    isWordDoc: function (type) {
        return type === Constants.FILE_TYPE.WORD;
    },
    isExcelDoc: function (type) {
        return type === Constants.FILE_TYPE.EXCEL;
    },
    isPowerPointDoc: function (type) {
        return type === Constants.FILE_TYPE.PPT;
    },
    isPdfDoc: function (type) {
        return type === Constants.FILE_TYPE.PDF;
    },
    isVideoDoc: function (type) {
        return type === Constants.FILE_TYPE.VIDEO;
    },
    isAudioDoc: function (type) {
        return type === Constants.FILE_TYPE.AUDIO;
    },
    isTxtDoc: function (type) {
        return type === Constants.FILE_TYPE.TXT;
    },
    isGeneralDoc: function (type) {
        return type === Constants.FILE_TYPE.GENERAL;
    },
    reloadCurrentPage: function(vm){
        vm.$message({type:'success',message:'正在刷新 ... '});
        window.location.reload();
    },
    buildQuery: function(url, params, tail){
        let query = '?';
        const keys = Object.keys(params);
        keys.forEach(function(key){
            query += key + '=' + params[key] + '&';
        });
        return url + query + tail + '=1';
    },
    cloneObject: function(obj) {
        return  Object.assign({}, obj);
    },
    beforeImageUpload: function(file, vueInstance){
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            vueInstance.$message.error('上传头像图片大小不能超过 1MB!');
        }
        return isLt1M;
    }
};