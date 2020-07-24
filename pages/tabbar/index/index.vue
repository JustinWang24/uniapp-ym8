<template>
	<view class="home">
		<navbar></navbar>
		<tab :tags="tags" :active-tab-index="activeTagIndex" v-on:tab-clicked="onTabClicked"></tab>
		<!-- 可进行水平滑动的新闻列表组件 -->
		<view class="home-list-wrap">
			<horizontal-swipe-list
				@tag-changed="tagChanged"
				:tags="tags" 
				:current-tag-index="activeTagIndex">
			</horizontal-swipe-list>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	import Util from '../../../common/utils.js';
	export default {
		computed:{
			...mapGetters(['currentUser']),
		},
		data() {
			return {
				tags:[],
				activeTagIndex:0, // 默认总是第一个高亮
			}
		},
		onLoad() {
			this.getTags();
		},
		methods: {
			getTags: function(){
				Util.getTags().then(res => {
					if(Util.isAjaxResOk(res)){
						this.tags = res.data.tags;
						this.$store.dispatch(
							'set_tags_of_topic',
							res.data.tagsOfTopic
						);
					}
				})
			},
			onTabClicked: function(payload){
				this.activeTagIndex = payload.idx;
			},
			// 当swiper被滑动之后, 发出的 tag-changed 事件的响应函数
			tagChanged: function(payload){
				this.activeTagIndex = payload.newIndex;
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		display: flex;
	}
	.home{
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;
	}
	.home-list-wrap{
		flex: 1; // 撑开
		box-sizing: border-box;
	}
</style>
