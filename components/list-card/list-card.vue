<template>
	<view>
		<!-- 基础卡片 -->
		<view class="card" v-if="parseCardType() === 'news'" @click="onNewsItemClicked">
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
		<view class="card big-image" v-if="parseCardType() === 'topic'" @click="onTopicClicked">
			<view class="thumbnail" v-if="item.picture">
				<image src="../../static/logo.png" mode="aspectFill"></image>
			</view>
			<view class="content">
				<view class="title">
					<text>{{ item.title }}</text>
				</view>
				<view class="snippet">
					<view class="tag">
						<view class="tag-txt" v-for="(tagText,idx) in item.tags" :key="buildUniqueIdx(item, idx)">{{tagText}}</view>
					</view>
					<view class="views-count">{{ item.views }}浏览</view>
				</view>
			</view>
		</view>
		<!-- 用户的卡片 -->
		<view class="card person" v-if="parseCardType() === 'person'" @click="onPersonClicked">
			<view class="thumbnail" v-if="item.picture">
				<image :src="item.picture" mode="aspectFill"></image>
			</view>
			<view class="content">
				<view class="title">
					<text>{{ item.name }}</text>
				</view>
				<view class="last-topic">
					<view class="piece-title">{{ item.t_title }}</view>
					<view class="piece-icons">
						<view class="piece"><uni-icons type="heart" color="#999" size="14px"></uni-icons> {{ item.t_views }}</view>
						<view class="piece"><uni-icons type="hand-thumbsdown" color="#999" size="14"></uni-icons> {{ item.t_thumb_up }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 产品的卡片 -->
		<view class="card with-multi-images" v-if="parseCardType() === 'product'" @click="onProductClicked">
			<view class="content">
				<view class="title product-title">
					<view class="product-name">{{ item.name }}</view>
					<view class="fineness">{{ finenessText }}</view>
				</view>
				<view class="thumbnail">
					<view v-for="(img, index) in item.images" :key="index" v-if="index < 3" class="multi-img">
						<image :src="img" mode="aspectFill"></image>
					</view>
				</view>
				<view class="snippet">
					<view class="tag">
						<view class="tag-txt">{{ item.location }}</view>
					</view>
					<view class="price-tag">
						<text class="current">现价: ${{ item.price }}</text>
						<text class="orig">原价:${{ item.full_price }}</text>
					</view>
					<view class="views-count">{{ item.views }}浏览</view>
				</view>
			</view>
		</view>
		<!-- 大图模式的卡片 -->
		<view class="card big-image" v-if="parseCardType() === 'topic_big_image'"  @click="onTopicClicked">
			<view class="thumbnail">
				<image :src="item.images[0]" mode="aspectFill"></image>
			</view>
			<view class="content">
				<view class="title">
					<text>{{ item.title }}</text>
				</view>
				<view class="snippet">
					<view class="tag">
						<view class="tag-txt" v-for="(tagText,idx) in item.tags" :key="buildUniqueIdx(item, idx)">{{tagText}}</view>
					</view>
					<view class="views-count">{{ item.views }}浏览</view>
				</view>
			</view>
		</view>
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
			cardType: function(){
				if(this.type.indexOf('news') > -1 || this.item.title_cn) {
					return 'news';
				} else if(this.type === 'person' || this.type === 'topic_friend'){
					return 'person';
				} else if(this.type === 'topic_buy') {
					return 'product';
				} else if(this.type.indexOf('topic') > -1){
					if(this.item.images && this.item.images.length > 0){
						return 'topic_big_image'
					} else {
						return 'topic';
					}
				}
			},
			finenessText: function(){
				const v = this.item.fineness / 10;
				return v === 10 ? '全新' : (v + '成新')
			}
		},
		data() {
			return {
				
			};
		},
		methods: {
			parseCardType: function(){
				if(this.type.indexOf('news') > -1 || this.item.title_cn) {
					return 'news';
				} else if(this.type === 'person'){
					return 'person';
				} else if(this.type === 'topic_buy') {
					return 'product';
				} else if(this.type.indexOf('topic') > -1){
					if(this.item.images && this.item.images.length > 0){
						return 'topic_big_image'
					} else {
						return 'topic';
					}
				}
			},
			onNewsItemClicked: function(){
				// const theFakeItem = {
				// 	traffic: this.item.views,
				// 	up: this.item.thumb_up,
				// 	id: this.item.uuid,
				// 	trend: this.item.tags.join(' '),
				// 	picture:''
				// };
				this.$emit('card-clicked',{item: this.item, type: this.cardType});
			},
			onTopicClicked: function(){
				// 当话题被点击
				const theFakeItem = {
					traffic: this.item.views,
					up: this.item.thumb_up,
					id: this.item.uuid,
					trend: this.item.tags.join(' '),
					picture:''
				};
				this.$emit('topic-clicked',{item: theFakeItem, type: this.cardType});
			},
			onPersonClicked: function(){
				this.$emit('person-clicked',{item: this.item, type: this.cardType});
			},
			onProductClicked: function(){
				this.$emit('product-clicked',{item: this.item, type: this.cardType});
			},
			buildUniqueIdx: function(item, idx){
				return item.id+'_'+idx;
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
	
	&.person{
		.content{
			.title{
				font-size: 16px;
				font-weight: bold;
			}
			.last-topic{
				font-size: 13px;
				color: #999;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.piece-icons{
					display: flex;
					justify-content: flex-end;
					.piece{
						margin-left: 5px;
					}
				}
			}
		}
	}

	// 多图时的样式
	&.with-multi-images{
		.content{
			width: 100%;
			padding: 0;
			.product-title{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.fineness{
					background-color: #007AFF;
					color: white;
					padding: 3px;
					border-radius: 5px;
					font-size: 11px;
					font-weight: bold;
					padding-right: 3px;
					text-align: right;
				}
				.product-name{
					font-weight: bold;
					color: #666666;
				}
			}
		}
		.thumbnail{
			display: flex;
			margin-top: 10px;
			width: 100%;
			height: 70px;
			.multi-img{
				margin-left: 10px;
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
			.price-tag{
				.current{
					font-size: 14px;
					font-weight: bold;
					padding-right:2px;
					color: #007AFF;
				}
				.orig{
					font-size: 13px;
					color: $mk-base-color;
					text-decoration: line-through;
					padding-left: 2px;
				}
			}
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
