// Vuex 状态管理
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
	// 数据源
	state:{
		historyList:[],
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
			commit('SET_HISTORY_LIST', theList);
		},
		// 清空历史记录
		clear_history({commit, state}, historyItem){
			commit('SET_HISTORY_LIST', []);
		}
	}
})

export default store;