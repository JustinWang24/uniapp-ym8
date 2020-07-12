import Constants from './constants.js';
import request from './request.js';

export default {
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