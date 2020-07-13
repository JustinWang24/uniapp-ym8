<template>
	<view class="detail">
		<view class="title">
			<text>{{ article.title }}</text>
		</view>
		<view class="header">
			<view class="avatar">
				<image :src="article.picture" mode="aspectFill"></image>
			</view>
			<view class="header-content">
				<view class="author">{{ article.trend }}</view>
				<view class="info">
					<text>已关注: {{ article.traffic }}+</text>
					<text>赞: 2345</text>
				</view>
				<view></view>
			</view>
		</view>
		<view class="content">
			<u-parse :content="article.content" :noData="noData"></u-parse>
		</view>
		<view class="toolbar">
			<view class="input-box">
				<text>发表评论</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="icons-wrap">
				<view class="icons-box">
					<uni-icons type="chat" size="20" color="#f07373"></uni-icons>
				</view>
				<view class="icons-box">
					<uni-icons type="heart" size="20" color="#f07373"></uni-icons>
				</view>
				<view class="icons-box">
					<uni-icons type="hand-thumbsup" size="20" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Util from '../../common/utils.js';
	import uParse from '@/components/gaoyia-parse/parse.vue';
	
	export default {
		components:{
			uParse,
		},
		data() {
			return {
				article:{},
				noData:'<p style="text-align:center;color:#666;">详情加载中 ...</p>',
			};
		},
		onLoad(query){
			// 获取传递过来的参数, 实现部分数据的预加载
			const params = JSON.parse(query.params);
			params.title = '';
			params.content = '';
			this.article = params;
			this.loadItemContent();
		},
		
		methods:{
			loadItemContent: function() {
				Util.getContentById(this.article.id, this.article.type).then(res => {
					if(Util.isAjaxResOk(res)){
						this.article.title = res.data.item.title;
						this.article.content = '<div>' + res.data.item.content + '</div>';
					}
				});
			}
		}
	}
</script>

<style lang="scss">
.detail{
	padding: 15px 0;
	.title{
		padding: 5px 15px;
		color: #333;
		font-size: 18px;
		font-weight: bold;
	}
	.header{
		display: flex;
		align-items: center;
		border-top: solid 1px #f5f5f5;
		
		margin: 0 15px;
		padding-top: 15px;
		.avatar{
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;
			flex-shrink: 0;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.header-content{
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;
			padding-left: 10px;
			.author{
				font-size: 14px;
				color: #333;
			}
			.info{
				color: #999;
				text{
					padding-right: 5px;
				}
			}
		}
	}
	.content{
		height: 1000px;
		font-size: 14px;
		margin: 15px;
		padding-top: 15px;
		line-height: 25px;
		border-top: solid 1px #f5f5f5;
		font-size: #666;
	}
	
	.toolbar{
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: solid 1px #f5f5f5;
		background-color: white;
		box-sizing: border-box;
		.input-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-left: 10px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: solid 1px #ddd;
			border-radius: 5px;
			text{
				color: #999;
				font-size: 14px;
			}
		}
		.icons-wrap{
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;
			.icons-box{
				display: flex;
				align-items: center;
				position: relative;
				justify-content: center;
				width: 44px;
			}
		}
	}
}
</style>
