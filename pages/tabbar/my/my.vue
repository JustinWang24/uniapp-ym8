<template>
	<view>
		<view v-if="isLoggedIn">
			<view class="my-header">
				<view class="header-bg">
					<image :src="myAvatar" mode="aspectFill"></image>
				</view>
				
				<view class="avatar-wrap">
					<view class="avatar">
						<image :src="myAvatar" mode="aspectFill"></image>
					</view>
					<text class="name-txt">{{ currentUser.name }}</text>
				</view>
				
				<view class="profile">
					<view class="info-wrap">
						<text class="info-txt">关注数</text>
						<text>{{ currentUser.follows ? currentUser.follows.length : 0 }}</text>
					</view>
					<view class="info-wrap">
						<text class="info-txt">积分</text>
						<text>{{ currentUser.credits ? currentUser.credits : 0 }}</text>
					</view>
				</view>
			</view>
			
			<view class="my-content">
				<view class="content-list" @click="openMyProfile">
					<view class="title">
						<uni-icons class="icon" color="#666" type="contact" size="16px"></uni-icons>
						<text>我的个人资料</text>
					</view>
					<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
				</view>
				<view class="content-list" @click="openMyShop">
					<view class="title">
						<uni-icons class="icon" color="#666" type="shop" size="16px"></uni-icons>
						<text>我的二手商店</text>
					</view>
					<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
				</view>
				<view class="content-list" @click="openMyTopics">
					<view class="title">
						<uni-icons class="icon" color="#666" type="bars" size="16px"></uni-icons>
						<text>我的吐槽历史</text>
					</view>
					<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
				</view>
				<view class="content-list" v-if="false">
					<view class="title">
						<uni-icons class="icon" color="#666" type="email" size="16px"></uni-icons>
						<text>查看我的私信</text>
					</view>
					<uni-icons type="arrowright" size="14" color="#666"></uni-icons>
				</view>
			</view>
		</view>
		
		<view class="logout-btn-wrap" v-if="isLoggedIn">
			<button type="warn" @click="onLogout">退出</button>
		</view>
		<view class="entrance-wrap" v-else>
			<view class="title">
				<text>{{ startRegistration ? '新用户注册' : '用户登录' }}</text>
			</view>
			<view class="login-form-wrap" v-if="startRegistration">
				<form class="form login-form">
					<view class="uni-form-item">
						<input class="uni-input" v-model="signUpForm.name" placeholder="必填: 昵称" />
					</view>
					<view class="uni-form-item">
						<input class="uni-input" v-model="signUpForm.email" placeholder="必填: 电子邮件" />
					</view>
					<view class="uni-form-item">
						<input class="uni-input" v-model="signUpForm.phone" placeholder="必填: 手机号" />
					</view>
					<view class="uni-form-item">
						<input class="uni-input" v-model="signUpForm.password" placeholder="必填: 登录密码, 最短6位" />
					</view>
					<view class="uni-btn-v">
						<view class="h-btn"><button type="default" @click.stop="startRegistration = false">返回登录</button></view>
						<view class="h-btn"><button @click.stop="onSignUp" type="primary" :loading="isInLoginProgress">创建账号</button></view>
					</view>
				</form>
			</view>
			<view class="login-form-wrap" v-else>
				<form class="form login-form">
					<view class="uni-form-item">
						<input class="uni-input" v-model="loginForm.email" placeholder="用户名: 邮件或手机号" />
					</view>
					<view class="uni-form-item">
						<input class="uni-input" v-model="loginForm.password" :password="true" placeholder="登录密码" />
					</view>
					<view class="uni-btn-v">
						<view class="h-btn"><button @click.stop="onLogin" type="primary" :loading="isInSignUpProgress">登录</button></view>
						<view class="h-btn"><button type="default" @click.stop="startRegistration = true">新用户注册</button></view>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	import Util from '../../../common/utils.js';
	
	export default {
		computed:{
			...mapGetters(['currentUser']),
			myAvatar: function(){
				return this.currentUser.avatar ? this.currentUser.avatar : '../../../static/logo.png'
			}
		},
		onLoad() {
			this.isLoggedIn = this.currentUser.uuid !== undefined;
			this._resetLoginForm();
		},
		onShow(){
			if(this.isLoggedIn && !this.isMyTopicsHadBeenLoaded){
				this.loadMyTopicsAndFriends();
			}
		},
		data() {
			return {
				loginForm:{
					email:'',
					password:''
				},
				isInLoginProgress: false,
				isLoggedIn: false,
				isMyTopicsHadBeenLoaded: false,
				// 注册
				startRegistration: false,
				signUpForm:{
					name:'',
					email:'',
					phone:'',
					password:'',
				},
				isInSignUpProgress: false,
			};
		},
		methods:{
			onLogout: function(){
				this.$store.dispatch(
					'logout', 	// Action 中的方法名
					null 		// Action 的方法的第二个参数
				);
				this.isLoggedIn = false;
				this._resetLoginForm();
			},
			onLogin: function(e){
				this.isInLoginProgress = true;
				Util.login(this.loginForm.email, this.loginForm.password).then(res => {
					if(Util.isAjaxResOk(res)){
						// 登录成功
						this.$store.dispatch(
							'set_user_profile',
							this._prepareProfileObject(res.data.profile)
						);
						uni.showToast({
							title: '登录成功'
						})
						this.isLoggedIn = true;
						this.loadMyTopicsAndFriends();
					} else {
						// 登录失败
						uni.showToast({
							title: res.message
						})
					}
					this.isInLoginProgress = false;
				});
			},
			onSignUp: function(e){
				this.isInSignUpProgress = true;
				Util.signUp(this.signUpForm).then(res => {
					if(Util.isAjaxResOk(res)){
						// 注册成功
						this.$store.dispatch(
							'set_user_profile',
							this._prepareProfileObject(res.data.profile)
						);
						uni.showToast({
							title: '注册成功'
						})
						this.isLoggedIn = true;
					} else {
						// 注册失败
						uni.showToast({
							title: res.message
						})
					}
					this.isInSignUpProgress = false;
				});
			},
			_resetLoginForm: function(){
				this.loginForm.email = '';
				this.loginForm.password = '';
			},
			// 打开个人资料页
			openMyProfile: function(){
				uni.navigateTo({
					url: Util.buildParamsForHomeProfilePageUrl()
				})
			},
			// 打开我的二手店页面
			openMyShop: function(){
				// 先把店主设置为自己
				this.$store.dispatch(
					'set_current_shop_owner_uuid',
					this.currentUser.uuid
				);
				uni.navigateTo({
					url: Util.buildParamsForHomeProductsPageUrl()
				})
			},
			openMyTopics: function(){
				uni.navigateTo({
					url: Util.buildParamsForMyTopicsPageUrl()
				})
			},
			_prepareProfileObject: function(p){
				const profile = {
					uuid: p.id
				};
				const keys = Object.keys(p);
				keys.forEach(key => {
					profile[key] = p[key];
				});
				return profile;
			},
			loadMyTopicsAndFriends: function(){
				this.isMyTopicsHadBeenLoaded = true;
				// 登录成功之后, 去加载我关注的话题和我的朋友列表的第一页数据
				Util.myTopics(0, 0).then(res => {
					if(Util.isAjaxResOk(res)){
						const theTopics = [];
						res.data.items.forEach((t)=>{
							const tpc = {};
							tpc.id = t.id;
							tpc.uuid = t.uuid;
							tpc.views = t.views;
							tpc.thumb_up = t.thumb_up;
							tpc.title = t.title;
							tpc.tags = JSON.parse(t.tags);
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
			height: 100px;
			border-radius: 50%;
			overflow: hidden;
			width: 100px;
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

.my-content{
	.content-list{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
		margin-bottom: 10px;
		background-color: #FFFFFF;
		color: #333333;
		font-size: 14px;
		.title{
			display: flex;
			align-items: center;
			.icon{
				margin-right: 10px;
			}
		}
	}
}
.logout-btn-wrap{
	padding: 0 15px;
}
.entrance-wrap{
	.title{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding-top: 40px;
		text{
			font-size: 24px;
			color: $mk-base-color;
			font-weight: bold;
			margin-bottom: 20px;
		}
	}
	.login-form-wrap{
		.form{
			display: flex;
			flex-direction: column;
			padding: 0 15px;
			box-sizing: border-box;
			.uni-form-item{
				width: 100%;
				margin-bottom: 10px;
				.uni-input{
					background-color: white;
					padding: 10px;
					border-radius: 10px;
					font-size: 14px;;
				}
			}
			.uni-btn-v{
				display: flex;
				justify-content: space-between;
				.h-btn{
					width: 40%;
					button{
						margin-bottom: 10px;
					}
				}
			}
		}
	}
}
</style>
