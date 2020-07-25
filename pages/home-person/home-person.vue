<template>
	<view>
		<view class="my-header">
			<view class="header-bg">
				<image :src="user.picture ? user.picture : '../../../static/logo.png'" mode="aspectFill"></image>
			</view>
			
			<view class="avatar-wrap">
				<view class="avatar">
					<image :src="user.picture ? user.picture : '../../../static/logo.png'" mode="aspectFill"></image>
				</view>
				<text class="name-txt">{{ user.name }} 的个人主页</text>
			</view>
			
			<view class="profile">
				<view class="info-wrap">
					<text class="info-txt">关注数</text>
					<text>{{ user.follows ? user.follows.length : 0 }}</text>
				</view>
				<view class="info-wrap">
					<text class="info-txt">积分</text>
					<text>{{ user.credits ? user.credits : 0 }}</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="intro-area">
				<view class="intro-title">
					<text>个人简介:</text>
				</view>
				<view>
					<u-parse :content="salesIntro" :noData="noIntro"></u-parse>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Constants from '../../common/constants.js';
	import Util from '../../common/utils.js';
	import {mapGetters} from 'vuex';
	import uParse from '@/components/gaoyia-parse/parse.vue';
	
	export default {
		components:{
			uParse,
		},
		computed:{
			...mapGetters(['currentUser']),
			salesIntro: function(){
				if(!Util.isEmpty(this.user.intro)){
					const arr = this.user.intro.split('\n');
					return arr.join('<br>');
				}
				return '';
			}
		},
		onLoad(query) {
			if(!Util.isEmpty(query)){
				const params = JSON.parse(query.params);
				this.user.id = params.id;
				this.user.uuid = params.uuid;
				this.user.name = params.name;
				this.user.picture = params.picture;
				this.loadUser(params.uuid)
			}
		},
		data() {
			return {
				user:{
					id:'',
					uuid:'',
					name:'',
					picture:'',
					intro:'',
				},
				noIntro:'这家伙很懒, 什么也没写'
			};
		},
		methods:{
			loadUser: function(uuid){
				if(!Util.isEmpty(uuid)){
					Util.getUserProfile(uuid).then(res => {
						if(Util.isAjaxResOk(res)){
							this.user.intro = res.data.profile.intro;
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.my-header{
	padding-bottom: 15px;
	position: relative;
	.header-bg{
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		filter: blur(8px);
		opacity: 0.3;
		image{
			width: 100%;
			height: 100%;
		}
	}
	
	.avatar-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 30px;
		.avatar{
			height: 120px;
			border-radius: 50%;
			overflow: hidden;
			width: 120px;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.name-txt{
			margin-top: 15px;
			font-weight: bold;
			font-size: 16px;
		}
	}

	.profile{
		margin-top: 15px;
		display: flex;
		.info-wrap{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 100%;
			font-size: 12px;
			color: #999999;
			.info-txt{
				color: #333333;
				font-size: 14px;
			}
		}
	}
}

.content{
	display: flex;
	border-top: solid 1px #F5F5F5;
	padding: 15px;
	.intro-area{
		margin-top: 10px;
		font-size: 14px;
		line-height: 1.6;
		color: #555555;
		width: 100%;
		.intro-title{
			color: #999;
			font-size: 18px;
			border-bottom: solid 1px #e6e6e6;
			padding-bottom: 5px;
			margin-bottom: 5px;
		}
	}
}
</style>
