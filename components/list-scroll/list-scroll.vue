<template>
	<view class="scroll-items">
		<!-- 上下滚动的所有新闻项目 -->
		<scroll-view 
			class="scroll-view-wrap" 
			scroll-y="true"
			@scrolltoupper="onScrollToUpper"
			@scrolltolower="onScrollToLower">
			<view>
				<!-- 新闻卡片 -->
				<uni-load-more v-if="needLoadMore && showLoadMoreTop" iconType="snow" status="loading"></uni-load-more>
				<view>
					<list-card
						v-for="(item, idx) in theLocalTag.items" 
						:key="idx" 
						:type="theLocalTag.type" 
						:item="item"
						@card-clicked="onCardClicked"
						@topic-clicked="onTopicClicked"
						@person-clicked="onPersonClicked"
						@product-clicked="onProductClicked"
					></list-card>
				</view>
				<uni-load-more v-if="needLoadMore" iconType="snow" :status="loadMoreStatus"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>


<script>
	import Util from '../../common/utils.js';
	export default {
		props:{
			theTag:{
				type: Object,
				default(){
					return {
						type:'', // 第一版 au_news, topic_arrive, topic_buy, topic_frind, topic_job
						name:'',
						items:[]
					}
				}
			},
			needLoadMore: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				theLocalTag:this.theTag,
				loadMoreStatus: 'noMore',
				showLoadMoreTop: false, // 顶部的拉动刷新控件
				currentPage: 1, // 当前的分页编号, 分页为0的在启动时已经加载了，所以这里是1
			};
		},
		methods:{
			// 当滚动动页面最下方
			onScrollToLower: function(e){
				this.loadMoreStatus = 'loading';
				Util.loadMoreByTag('bottom',this.theLocalTag.type, this.currentPage)
					.then(res => {
						if(Util.isAjaxResOk(res)){
							this.loadMoreStatus = 'noMore';
							if(res.data.items.length > 0){
								// 有更多新闻加载
								res.data.items.forEach(item => {
									this.theLocalTag.items.push(item);
								})
							}
						}
					})
			},
			// 当滚动到页面最上方
			onScrollToUpper: function(e){
				// 获取最顶端的item的id
				let firstId = 0;
				if(this.theLocalTag.items.length > 0){
					firstId = this.theLocalTag.items[0].id;
				}
				this.showLoadMoreTop = true;
				Util.loadMoreByTag('top',this.theLocalTag.type, this.currentPage, firstId)
					.then(res => {
						if(Util.isAjaxResOk(res)){
							this.showLoadMoreTop = false;
							if(res.data.items.length > 0){
								// 有更多新闻加载
								res.data.items.forEach(item => {
									this.theLocalTag.items.unshift(item);
								})
							}
						}
					})
			},
			// 当列表中的项被点击时: 新闻
			onCardClicked: function(payload){
				// 在列表中，显示一些东西，表示该项目被点击过
				// 再发布该事件: 表示该列表的类型, 例如新闻，话题，搜索结果等
				this.$emit('card-list-item-clicked',{type:this.theTag.type, item: payload.item});
			},
			// 话题被点击
			onTopicClicked: function(payload){
				this.$emit('card-list-item-clicked',{type:this.theTag.type, item: payload.item});
			},
			// 交友, 是主题的一种，做一下特殊处理, 用在 关注->好友 模块中
			onPersonClicked: function(payload){
				// 表示查看一个关注的人的个人资料
				this.$emit('card-list-item-clicked',payload);
			},
			// 二手市场
			onProductClicked: function(payload) {
				this.$emit('card-list-item-clicked',payload);
			}
		}
	}
</script>

<style lang="scss">
.scroll-items{
	flex: 1;
	box-sizing: border-box;
	overflow: hidden;
	height: 100%;
	.scroll-view-wrap{
		height: 100%;
		display: flex;
		flex-direction: column;
	}
}
</style>
