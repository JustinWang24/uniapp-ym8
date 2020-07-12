<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 手机顶部的状态栏 -->
			<view :style="{height: statusBarHeight  + 'px'}"></view>
			<!-- 导航栏的搜索栏 -->
			<view class="navbar-content" :class="{withBack:isSearch}" :style="{height: navBarHeight + 'px', width: searchBarWidth + 'px'}">
				<view class="back-to-btn" v-if="isSearch" @click.stop="onBack">
					<uni-icons type="back" size="20" color="#fff"></uni-icons>
				</view>
				
				<view v-if="isSearch" class="navbar-search">
					<!-- 真实搜索功能 -->
					<input class="query-input" type="text" v-model="query" placeholder="请输入你感兴趣的话题 ..." @input="onInputChange">
				</view>
				
				<view v-else class="navbar-search" @click.stop="openSearchPage">
					<!-- 不需要搜索功能 -->
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">搜索 澳洲最新资讯 吃喝玩乐 吐槽大会</view>
				</view>
				
			</view>
		</view>
		<view class="navbar-placeholder" :style="{height: statusBarHeight + navBarHeight + 'px'}">
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			isSearch:{
				type:Boolean,
				default: false,
			}
		},
		data() {
			return {
				statusBarHeight: 0, // 在微信小程序，手机app中，设备顶部的状态栏的高度
				navBarHeight: 45,	// 导航栏的高度
				widthFix: 30,
				searchBarWidth: 375,
				// 搜索关键字
				query: '',
			};
		},
		created() {
			// 在组件中，相当于 onLoad
			// 获取手机系统信息
			const systemInfo = uni.getSystemInfoSync();
			// 获取手机的状态栏的高度
			this.statusBarHeight = systemInfo.statusBarHeight;
			this.searchBarWidth = systemInfo.windowWidth - this.widthFix; // 本来应该是375, 为什么要减去 30， 也没明白
			
			/**
			 * 以下内容只在小程序里面才需要, 因此借助条件编译
			 */
			// #ifndef H5 || APP-PLUS || MP-ALIPAY
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect(); // 获取微信小程序胶囊的位置
			this.navBarHeight = (menuButtonInfo.bottom - this.statusBarHeight) + (menuButtonInfo.top - this.statusBarHeight) + 4;
			// 小程序中的搜索框宽度
			this.searchBarWidth = menuButtonInfo.left - this. widthFix;
			// #endif
		},
		methods:{
			openSearchPage: function(){
				uni.navigateTo({
					url:'/pages/home-search/home-search'
				})
			},
			onBack: function(){
				// uni.navigateBack({
				// 	animationDuration:300
				// })
				uni.switchTab({
					url:'/pages/tabbar/index/index'
				})
			},
			onInputChange: function(e){
				const {value} = e.detail;
				this.$emit('input', {value: value});
			}
		}
	}
</script>

<style lang="scss">
	$nav-bar-search-height: 32px;
	.navbar{
		.navbar-fixed{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			background-color: $mk-base-color;
			box-sizing: border-box;
			width: 100%;
			.navbar-content{
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 15px;
				height: $default-bar-height;
				.navbar-search{
					height: $nav-bar-search-height;
					background-color: white;
					display: flex;
					align-items: center;
					width: 100%;
					border-radius: $nav-bar-search-height;
					padding: 0 10px;
					.navbar-search_icon{
						margin-right: 10px;
					}
					.navbar-search_text{
						font-size: 12px;
						color: #999999;
						margin-top: 2px;
					}
					// 搜索内容输入框
					.query-input{
						font-size: 12px;
						margin-top: 3px;
						width: 100%;
					}
				}
				&.withBack{
					padding-left: 0;
					.back-to-btn{
						margin-left: 10px;
						margin-right: 10px;
					}
					.navbar-search{
						border-radius: 5px;
					}
				}
			}
		}
	}
</style>
