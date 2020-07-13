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
	},
	mutations:{
		SET_HISTORY_LIST(state, newHistoryList){
			state.historyList = newHistoryList;
		},
		SET_USER_PROFILE(state, userProfile){
			state.userProfile = userProfile;
		},
	},
	actions:{
		set_history({commit, state}, historyItem){
			let theList = state.historyList;
			theList.unshift(historyItem);
			uni.setStorageSync('__history', theList); // 持久化到本地缓存中
			commit('SET_HISTORY_LIST', theList);
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
			commit('SET_USER_PROFILE', currentProfile);
		},
		// 用户退出
		logout({commit, state}, profile){
			uni.removeStorageSync('__profile'); // 清理本地缓存
			commit('SET_USER_PROFILE', {});
		}
	},
	getters: {
		// 获取当前的用户信息
		currentUser: state => {
			return state.userProfile
		}
	}
})

export default store;