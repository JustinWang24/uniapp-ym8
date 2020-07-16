<template>
	<view>
		<!-- 基础卡片 -->
		<view class="card" @click="onItemClicked" v-if="cardType === 'news'">
			<view class="thumbnail">
				<image :src="item.picture" mode="aspectFill"></image>
			</view>
			<view class="content">
				<view class="title">
					<text>{{ item.title_cn }}</text>
				</view>
				<view class="snippet">
					<view class="tag">
						<view class="tag-txt">{{ item.trend }}</view>
					</view>
					<view class="views-count">
						<!-- 关注按钮组件 -->
						<like-button :item="item"></like-button>
					</view>
				</view>
			</view>
		</view>
		<!-- 话题的卡片 -->
		<view class="card big-image" v-if="cardType !== 'news'" @click="onTopicClicked">
			<view class="thumbnail" v-if="item.picture">
				<image src="../../static/logo.png" mode="aspectFill"></image>
			</view>
			<view class="content">
				<view class="title">
					<text>{{ item.title }}</text>
				</view>
				<view class="snippet">
					<view class="tag">
						<view class="tag-txt" v-for="(tagText,idx) in item.tags" :key="item.id+'_'+idx">{{tagText}}</view>
					</view>
					<view class="views-count">{{ item.views }}浏览</view>
				</view>
			</view>
		</view>
		<!-- 多图模式的卡片 -->
		<!-- <view class="card with-multi-images">
			<view class="content">
				<view class="title">
					<text>标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</text>
				</view>
				<view class="thumbnail">
					<view v-for="(img, index) in 3" :key="index" class="multi-img">
						<image src="../../static/logo.png" mode="aspectFill"></image>
					</view>
				</view>
				<view class="snippet">
					<view class="tag">
						<view class="tag-txt">澳洲新闻</view>
					</view>
					<view class="views-count">100浏览</view>
				</view>
			</view>
		</view> -->
		<!-- 大图模式的卡片 -->
		<!-- <view class="card big-image">
			<view class="thumbnail">
				<image src="../../static/logo.png" mode="aspectFill"></image>
			</view>
			<view class="content">
				<view class="title">
					<text>标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</text>
				</view>
				<view class="snippet">
					<view class="tag">
						<view class="tag-txt">澳洲新闻</view>
					</view>
					<view class="views-count">100浏览</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		props:{
			type:{
				type: String,
				default(){
					return '';
				}
			},
			item:{
				type: Object,
				default(){
					return {}
				}
			}
		},
		computed:{
			cardType:function(){
				return this.type.indexOf('news') > -1 ? 'news' : 'topic';
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			onItemClicked: function(){
				this.$emit('card-clicked',{item: this.item});
			},
			onTopicClicked: function(){
				// 当话题被点击
				const theFakeItem = {
					traffic: this.item.views,
					up: this.item.thump_up,
					id: this.item.uuid,
					trend: this.item.tags.join(' '),
					picture:''
				};
				this.$emit('card-clicked',{item: theFakeItem});
			}
		}
	}
</script>

<style lang="scss">
.card{
	display: flex;
	flex-direction: row;
	padding: 10px;
	margin:10px;
	border-radius: 5px;
	box-shadow: 0 0 5px 1px rgba($color: #f5f5f5, $alpha: 1.0);
	box-sizing: border-box;
	background-color: white;
	.thumbnail{
		width: 60px;
		height: 60px;
		border-radius: 5px;
		overflow: hidden;
		flex-shrink: 0; // 防止图片被挤压
		image{
			width: 100%;
			height: 100%;
		}
	}
	.content{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 10px;
		width: 100%;
		.title{
			font-size: 14px;
			color: #333;
			font-weight: 6;
			line-height: 1.2;
			text{ // 处理文字过长时，只现实两行 多余用.. 代替
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.snippet{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			font-size: 12px;
			.tag{
				display: flex;
				.tag-txt{
					padding: 0 5px;
					margin-right: 5px;
					border-radius: 15px;
					border: 1px $mk-base-color solid;
					color: $mk-base-color;
				}
			}
			.views-count{
				color: $mk-base-color;
				line-height: 1.5;
			}
		}
		.desc{
			
		}
	}

	// 多图时的样式
	&.with-multi-images{
		.content{
			width: 100%;
			padding: 0;
		}
		.thumbnail{
			display: flex;
			margin-top: 10px;
			width: 100%;
			height: 70px;
			.multi-img{
				margin-left: 10;
				width: 100%;
				border-radius: 5px;
				overflow: hidden;
				&:first-child{
					margin-left: 0;
				}
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.snippet{
			margin-top:10px;
		}
	}
	
	// 大图的模式
	&.big-image{
		flex-direction: column;
		.thumbnail{
			width: 100%;
			height: 100px;
		}
		.content{
			padding-left: 0;
			margin-top: 10px;
		}
		.snippet{
			margin-top:10px;
		}
	}
}
</style>
