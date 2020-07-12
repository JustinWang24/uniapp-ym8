// Vuex 状态管理
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
	// 数据源
	state:{
		historyList:uni.getStorageSync('__history')||[], // 以持久化的方式获取，从本地缓存中获取。如果 __history 不存在, 则返回空数组
	},
	mutations:{
		SET_HISTORY_LIST(state, newHistoryList){
			state.historyList = newHistoryList;
		}
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
		}
	}
})

export default store;