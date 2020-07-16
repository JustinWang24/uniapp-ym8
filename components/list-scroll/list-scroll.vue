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
				<list-card 
					v-for="(item, idx) in theLocalTag.items" 
					:key="idx" 
					:type="theLocalTag.type" 
					:item="item"
					@card-clicked="onCardClicked"
				></list-card>
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
					return {}
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
			// 当列表中的项被点击时
			onCardClicked: function(payload){
				// 在列表中，显示一些东西，表示该项目被点击过
				// 再发布该事件: 表示该列表的类型, 例如新闻，话题，搜索结果等
				this.$emit('card-list-item-clicked',{type:this.theTag.type, item: payload.item});
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
