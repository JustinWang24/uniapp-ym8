<template>
	<view class="home">
		<navbar :is-search="true" @input="onInputChange"></navbar>
		<view class="home-list">
			<view class="label-box" v-if="!showSearchResult">
				<view class="label-header">
					<text class="label-title">搜索历史</text>
					<text class="label-clear" @click="clearHistory">清空</text>
				</view>
				<view class="label-content" v-if="historyList.length > 0">
					<view @click="onSearchHistoryItemClicked(item.name)" class="label-item" v-for="(item, idx) in historyList" :key="idx">{{ item.name }}</view>
				</view>
				<view v-if="historyList.length === 0" class="no-data">没有找到搜索历史记录</view>
			</view>
			<view class="search-result" v-else>
				<list-scroll
					class="swiper-item-list" 
					:theTag="searchResult"
					:needLoadMore="false"
					@card-list-item-clicked="onListItemClicked">
				</list-scroll>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import Util from '../../common/utils.js';
	export default {
		computed:{
			...mapState(['historyList'])
		},
		data() {
			return {
				showSearchResult: false,
				searchResult:{
					type:'search_result',
					items:[]
				},
				lastSearchAt:false,
				lastSearchKeyword:'',
			};
		},
		methods:{
			onInputChange: function(payload){
				if(!this.lastSearchAt){
					this.lastSearchAt = true;
					this.timer = setTimeout(()=>{
						this.lastSearchAt = false;
						let q = payload.value.trim();
						if(q.length < 2){
							this.searchResult.items = [];
							this.showSearchResult = false;
						} else {
							this.lastSearchKeyword = q; // 记录下最后一个搜索的关键字
							this._doSearch(q);
						}
					}, 900); // 两次搜索之间必有900毫秒的延迟
				}
			},
			pushKeywordToHistory: function(keyword){
				this.$store.dispatch(
					'set_history', // Action 中的方法名
					{name: keyword} // Action 的方法的第二个参数
				)
			},
			clearHistory: function(){
				this.$store.dispatch(
					'clear_history', // Action 中的方法名
					null // Action 的方法的第二个参数
				)
				uni.showToast({
					title:'搜索历史已清空'
				})
			},
			// 当搜索结果列表中的项目被点击
			onListItemClicked: function(payload){
				// 只有结果被点击, 才把关键字推入到搜索历史结果中
				this.pushKeywordToHistory(this.lastSearchKeyword);
			},
			// 直接点击搜索历史中的关键字的响应
			onSearchHistoryItemClicked: function(q){
				this._doSearch(q);
			},
			_doSearch: function(q){
				Util.searchByKeyword(q).then(res => {
					if(Util.isAjaxResOk(res) && res.data.items.length > 0){
						this.searchResult.items = res.data.items;
						this.showSearchResult = true;
					} else {
						this.showSearchResult = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	height: 100%;
	display: flex;
	background-color: #f5f5f5;
}
.home{
	display: flex;
	flex-direction: column;
	flex: 1;
	.label-box{
		background-color: white;
		margin-bottom: 10px;
		.label-header{
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			color: #666;
			padding: 10px 15px;
			border-bottom: solid 1px #f5f5f5;
			.label-title{
				color: $mk-base-color;
			}
			.label-clear{
				color: #30b33a;
				font-weight: bold;
			}
		}
		.label-content{
			display: flex;
			flex-wrap: wrap;
			padding: 15px;
			padding-top: 0;
			.label-item{
				padding: 2px 10px;
				margin-top: 12px;
				margin-right: 10px;
				border-radius: 5px;
				border: solid 1px #666;
				font-size: 14px;
				color: #666;
			}
		}
		.no-data{
			height: 200px;
			line-height: 200px;
			width: 100%;
			text-align: center;
			color: #666;
			font-size: 12px;
		}
	}
}
</style>
