// Vuex 状态管理
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import Util from '../common/utils.js';

const store = new Vuex.Store({
	// 数据源
	state:{
		historyList: uni.getStorageSync('__history')||[], // 以持久化的方式获取，从本地缓存中获取。如果 __history 不存在, 则返回空数组
		userProfile: uni.getStorageSync('__profile')||{}, // 用户数据
		isTheUserLoggedIn: false,
		// 当前用户关注的话题
		myTopics: {
			type:'topic',
			items:[]
		},
		// 当前用户的朋友列表
		myGroup:{
			type:'person',
			items:[]
		},
		// 当前正在浏览的商店的主人的uuid
		currentShopOwnerUuid:null,
		// 吐槽可以包含的标题
		tagsOfTopic: []
	},
	mutations:{
		SET_IS_USER_LOGGED_IN(state, status){
			state.isTheUserLoggedIn = status;
		},
		SET_HISTORY_LIST(state, newHistoryList){
			state.historyList = newHistoryList;
		},
		SET_USER_PROFILE(state, userProfile){
			state.userProfile = userProfile;
		},
		SET_MY_TOPICS(state, topics){
			state.myTopics.items = topics;
		},
		SET_MY_GROUP(state, friends){
			state.myGroup.items = friends;
		},
		SET_CURRENT_SHOP_OWNER_UUID(state, uuid){
			state.currentShopOwnerUuid = uuid;
		},
		SET_TAGS_OF_TOPIC(state, tags){
			state.tagsOfTopic = tags;
		},
	},
	actions:{
		set_tags_of_topic({commit, state}, tags){
			commit('SET_TAGS_OF_TOPIC', tags);
		},
		set_current_shop_owner_uuid({commit, state}, uuid){
			commit('SET_CURRENT_SHOP_OWNER_UUID', uuid);
		},
		set_history({commit, state}, historyItem){
			let theList = state.historyList;
			let exist = false;
			for(let i=0;i<theList.length;i++){
				if(theList[i].name === historyItem.name){
					exist = true;
					break;
				}
			}
			if(!exist){
				theList.unshift(historyItem);
				uni.setStorageSync('__history', theList); // 持久化到本地缓存中
				commit('SET_HISTORY_LIST', theList);
			}
		},
		// 清空历史记录
		clear_history({commit, state}, historyItem){
			uni.removeStorageSync('__history'); // 清理本地缓存
			commit('SET_HISTORY_LIST', []);
		},
		// 设置当前的用户资料数据
		set_user_profile({commit, state}, profile){
			const keys = Object.keys(profile);
			let currentProfile = state.userProfile;
			keys.forEach(key => {
				currentProfile[key] = profile[key];
			});
			uni.setStorageSync('__profile', currentProfile);
			commit('SET_IS_USER_LOGGED_IN', !Util.isEmpty(currentProfile.uuid));
			commit('SET_USER_PROFILE', currentProfile);
		},
		// 用户退出
		logout({commit, state}, profile){
			uni.removeStorageSync('__profile'); // 清理本地缓存
			commit('SET_IS_USER_LOGGED_IN', false);
			commit('SET_USER_PROFILE', {});
		},
		// 设置当前的话题
		set_my_topics({commit, state}, topics){
			commit('SET_MY_TOPICS',topics);
		},
		add_my_topic({commit, state}, topic){ // 新增了一个关注列表
			const theTopics = state.myTopics.items;
			theTopics.unshift(topic);
			commit('SET_MY_TOPICS',theTopics);
		},
		remove_my_topic({commit, state}, topic){ // 取消一个关注的话题
			const theTopics = state.myTopics.items;
			let theIdx = -1;
			const len = theTopics.length;
			for(let i=0;i<len;i++){
				if(theTopics[i].id === topic.id){
					theIdx = i;
					break;
				}
			}
			if(theIdx > -1){
				theTopics.splice(theIdx, 1);
				commit('SET_MY_TOPICS',theTopics);
			}
		},
		// 设置当前的朋友列表
		set_my_friends({commit, state}, friends){
			commit('SET_MY_GROUP',friends);
		},
		add_my_friend({commit, state}, friend){ // 新增了一个friend
			const theFriends = state.myGroup.items;
			theFriends.unshift(friend);
			commit('SET_MY_GROUP',theFriends);
		},
		remove_my_friend({commit, state}, friend){ // 取消一个关注的话题
			const theFriends = state.myGroup.items;
			let theIdx = -1;
			const len = theFriends.length;
			for(let i=0;i<len;i++){
				if(theFriends[i].id === friend.id){
					theIdx = i;
					break;
				}
			}
			if(theIdx > -1){
				theFriends.splice(theIdx, 1);
				commit('SET_MY_GROUP',theFriends);
			}
		}
	},
	getters: {
		// 获取当前的用户信息
		currentUser: state => {
			return state.userProfile;
		},
		myTopics: state => {
			return state.myTopics;
		},
		myGroup: state => {
			return state.myGroup;
		},
		currentShopOwnerUuid: state => {
			return state.currentShopOwnerUuid;
		},
		tagsOfTopic: state => {
			return state.tagsOfTopic;
		},
		isTheUserLoggedIn: state => {
			return state.isTheUserLoggedIn;
		}
	}
})

export default store;