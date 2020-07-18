<template>
	<view class="follow">
		<view class="follow-tab">
			<view class="box">
				<view @click="tabClicked(1)" class="follow-item" :class="{active:activeIndex === 1}">话题</view>
				<view @click="tabClicked(2)" class="follow-item" :class="{active:activeIndex === 2}">好友</view>
			</view>
		</view>
		<view class="followed-list">
			<swiper class="followed-list-wrap" @change="onSwiperChange">
				<swiper-item>
					<view class="swiper-item">
						<list-scroll :theTag="myTopics" @card-list-item-clicked="onTopicListItemClicked">
							
						</list-scroll>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<list-scroll :theTag="myGroup" @card-list-item-clicked="onGroupListItemClicked">
							
						</list-scroll>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import Util from '../../../common/utils.js';
	export default {
		onLoad(){
			this.loadMyTopicsAndFriends();
		},
		data() {
			return {
				activeIndex: 1,
				myGroup:{
					type:'person',
					items:[]
				},
				myGroupIndex: 0,
				loadingGroup: false,
				// 我关注的话题
				myTopics:{
					type:'topic',
					items:[]
				},
				myTopicsIndex: 0,
				loadingTopics: false,
			}
		},
		methods: {
			tabClicked: function(idx){
				this.activeIndex = idx;
			},
			onTopicListItemClicked: function(payload){
				uni.navigateTo({
					url: Util.buildParamsForHomeDetailPageUrl(payload)
				});
			},
			onGroupListItemClicked: function(payload){
				
			},
			loadMyTopicsAndFriends: function(){
				this.loadingTopics = true;
				Util.myTopics(this.myTopicsIndex, this.myGroupIndex).then(res => {
					if(Util.isAjaxResOk(res)){
						this.myTopicsIndex++;
						res.data.items.forEach((t)=>{
							const tpc = {};
							tpc.id = t.id;
							tpc.uuid = t.uuid;
							tpc.views = t.views;
							tpc.thumb_up = t.thumb_up;
							tpc.title = t.title;
							tpc.tags = JSON.parse(t.tags);
							this.myTopics.items.push(tpc);
						});
						
						res.data.friends.forEach((t)=>{
							const tpc = {};
							tpc.id = t.id;
							tpc.uuid = t.uuid;
							tpc.name = t.name;
							tpc.picture = t.picture;
							// 朋友的最新的帖子
							tpc.t_title = t.t_title;
							tpc.t_views = t.t_views;
							tpc.t_thumb_up = t.t_thumb_up;
							tpc.t_uuid = t.t_uuid;
							this.myGroup.items.push(tpc);
						});
					}
					this.loadingTopics = false;
				}).catch(e => {
					this.loadingTopics = false;
				});
			},
			onSwiperChange: function(e){
				this.activeIndex = e.detail.current + 1;
			}
		}
	}
</script>

<style lang="scss">
page{
	height: 100%;
	display: flex;
}
.follow{
	display: flex;
	height: 100%;
	flex-direction: column;
	flex: 1;
	box-sizing: border-box;
	.follow-tab{
		height: 30px;
		padding: 10px 20px;
		border-bottom: solid 1px #f5f5f5;
		.box{
			width: 100%;
			height: 100%;
			display: flex;
			border-radius: 5px;
			border: solid 1px $mk-base-color;
			.follow-item{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				font-size: 14px;
				color: #666;
				&:first-child{
					border-right: solid 1px $mk-base-color;
				}
				&.active{
					color: $mk-base-color;
				}
			}
		}
	}
	
	.followed-list{
		flex: 1;
		.followed-list-wrap{
			height: 100%;
			.swiper-item{
				
			}
		}
	}
}
</style>
