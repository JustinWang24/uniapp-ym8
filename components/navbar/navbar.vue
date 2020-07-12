<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 手机顶部的状态栏 -->
			<view :style="{height: statusBarHeight  + 'px'}"></view>
			<view class="navbar-content" :style="{height: navBarHeight + 'px', width: searchBarWidth + 'px'}">
				<view class="navbar-search">
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">搜索</view>
				</view>
			</view>
		</view>
		<view class="navbar-placeholder" :style="{height: statusBarHeight + navBarHeight + 'px'}">
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: 0, // 在微信小程序，手机app中，设备顶部的状态栏的高度
				navBarHeight: 45,	// 导航栏的高度
				widthFix: 30,
				searchBarWidth: 375,
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
					}
				}
			}
		}
	}
</style>
