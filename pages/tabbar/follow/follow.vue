<template>
	<view class="follow">
		<view class="follow-tab">
			<view class="box">
				<view @click="tabClicked(0)" class="follow-item" :class="{active:activeIndex === 0}">好友</view>
				<view @click="tabClicked(1)" class="follow-item" :class="{active:activeIndex === 1}">话题</view>
			</view>
		</view>
		
		<view class="followed-list" v-if="isTheUserLoggedIn">
			<swiper class="followed-list-wrap" @change="onSwiperChange" :current="activeIndex">
				<swiper-item>
					<view class="swiper-item">
						<list-scroll :theTag="myGroup" @card-list-item-clicked="onGroupListItemClicked">
							
						</list-scroll>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<list-scroll :theTag="myTopics" @card-list-item-clicked="onTopicListItemClicked">
							
						</list-scroll>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="notes-wrap" v-else>
			<view class="text">
				<text>
					您还没有登录, 所以我们无法获取您的站内好友和关注的话题. 请您点击下面的右下角的 "我的首页", 进行登录或注册的操作.
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import Util from '../../../common/utils.js';
	import {mapGetters} from 'vuex';
	
	export default {
		computed:{
			...mapGetters(['currentUser','myTopics','myGroup','isTheUserLoggedIn']),
		},
		watch:{
			"isTheUserLoggedIn": function(newVal){
				if(newVal){
					this.loadMyTopicsAndFriends();
				}
			}
		},
		onShow(){
			if(this.isTheUserLoggedIn && this.isForceLoadingData && this.myTopics.items.length === 0 && this.myGroup.items.length === 0){
				// 表示有可能还没有加载, 因此尝试从服务器获取一次, 但只有一次
				this.isForceLoadingData = false;
			}
		},
		data() {
			return {
				activeIndex: 0,
				myGroupIndex: 0,
				loadingGroup: false,
				myTopicsIndex: 0,
				loadingTopics: false,
				// 是否当前是登录状态
				isForceLoadingData: true,
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
				uni.navigateTo({
					url: Util.buildParamsForFriendDetailPageUrl(payload)
				});
			},
			loadMyTopicsAndFriends: function(){
				this.loadingTopics = true;
				Util.myTopics(this.myTopicsIndex, this.myGroupIndex).then(res => {
					if(Util.isAjaxResOk(res)){
						this.myTopicsIndex++;
						const theTopics = [];
						res.data.items.forEach((t)=>{
							const tpc = {};
							tpc.id = t.id;
							tpc.uuid = t.uuid;
							tpc.views = t.views;
							tpc.thumb_up = t.thumb_up;
							tpc.title = t.title;
							tpc.tags = JSON.parse(t.tags);
							tpc.images = JSON.parse(t.images);
							theTopics.push(tpc);
						});
						this.$store.dispatch(
							'set_my_topics',
							theTopics
						);
						const theFriends = [];
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
							theFriends.push(tpc);
						});
						this.$store.dispatch(
							'set_my_friends',
							theFriends
						);
					}
					this.loadingTopics = false;
				}).catch(e => {
					this.loadingTopics = false;
				});
			},
			onSwiperChange: function(e){
				this.activeIndex = e.detail.current;
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
	.notes-wrap{
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		align-items: center;
		padding-top: 50px;
		.text{
			width: 80%;
			background-color: white;
			padding: 15px;
			border: solid 1px #f5f5f5;
			border-radius: 10px;
			line-height: 1.6;
			font-size: 14px;
		}
	}
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
					background-color: $mk-base-color;
					color: white;
				}
			}
		}
	}
	
	.followed-list{
		flex: 1;
		.followed-list-wrap{
			height: 100%;
		}
	}
}
</style>
