<template>
	<view class="product-view">
		<view class="title">
			<text>品名: {{ product.name }}</text>
		</view>
		<view class="header" v-if="product.user">
			<view class="avatar" @click.stop="goToUserProfile">
				<image :src="product.user.avatar" mode="aspectFill"></image>
			</view>
			<view class="header-content">
				<view class="author">
					<text class="location">卖家: {{ product.user.name }}, 地点: {{ product.location }}</text>
					<text class="fineness">{{ finenessText }}</text>
				</view>
				<view class="info">
					<text class="price">
						现价: ${{ product.price }}
					</text>
					<text class="price-origin">
						原价: ${{ product.full_price }}
					</text>
					<text class="views">
						浏览: {{ product.views }}
					</text>
				</view>
			</view>
		</view>
		<view class="content">
			<view>
				<text style="color: #007AFF;">
					商品详情:
				</text>
				<text>
					{{ product.desc }}
				</text>
			</view>
			<view class="comments-wrap" v-if="images && images.length > 0">
				<view class="comments-title">
					<text style="color: #007AFF;">商品图片</text>
					<text style="color: #666666;">(请以最终商品的实物为准)</text>
				</view>
				<view class="images" v-for="(img, idx) in images" :key="idx">
					<image :src="img" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	
		<view class="toolbar">
			<view class="input-box" @click.stop="onComment">
				<uni-icons size="16" color="#ffffff" type="phone"></uni-icons>
				<text style="margin-left: 10px;">联系卖家</text>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-wrap">
				<view class="area-head">
					<view class="head-item">
						<text>卖家简介</text>
					</view>
					<view class="head-item btn-close" @click.stop="closeComment">
						<text style="margin-right: 5px;">关闭</text>
						<uni-icons size="14" color="#ffffff" type="close"></uni-icons>
					</view>
				</view>
				<view class="content-editor" v-if="product.user">
					<view class="phone-btn" @click="callMe" v-if="product.user && product.user.phone">
						<text>拨打电话: {{ product.user.phone }}</text>
					</view>
					<view class="intro">
						<u-parse :content="salesIntro" :noData="noIntro"></u-parse>
					</view>
					<view class="notes">
						<text>移民吧无法审核商品的真伪,请注意自行核查,安全交易</text>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import Util from '../../common/utils.js';
	import {mapGetters} from 'vuex';
	import uParse from '@/components/gaoyia-parse/parse.vue';
	
	export default {
		components:{
			uParse,
		},
		computed: {
			...mapGetters(['currentUser']),
			finenessText: function(){
				const v = this.product.fineness / 10;
				return v === 10 ? '全新' : (v + '成新')
			},
			salesIntro: function(){
				const arr = this.currentUser.intro.split('\n');
				return arr.join('<br>');
			}
		},
		onLoad(query){
			// 获取传递过来的参数, 实现部分数据的预加载
			const params = JSON.parse(query.params);
			this.loadProduct(params.id);
		},
		data() {
			return {
				product:{
					
				},
				images:[],
				noIntro:'这家伙很懒, 什么也没写'
			};
		},
		methods:{
			loadProduct: function(id){
				Util.loadProductById(id).then(res => {
					if(Util.isAjaxResOk(res)){
						this.product.id = res.data.product.id;
						this.product.name = res.data.product.name;
						this.product.price = res.data.product.price;
						this.product.full_price = res.data.product.full_price;
						this.product.desc = res.data.product.desc;
						this.product.location = res.data.product.location;
						this.product.fineness = res.data.product.fineness;
						this.product.views = res.data.product.views;
						this.product.user = res.data.product.user;
						this.images = res.data.product.images;
					} else {
						uni.showToast({
							title:'产品已下架'
						})
					}
				})
			},
			// 联系卖家
			onComment: function(){
				this.$refs.popup.open();
			},
			closeComment: function(){
				this.$refs.popup.close();
			},
			callMe: function(){
				uni.makePhoneCall({
					phoneNumber: this.product.user.phone
				});
			},
			// 去卖家的主页
			goToUserProfile: function(){
				uni.navigateTo({
					url: Util.buildParamsForViewShopPageUrl(this.product.user.uuid)
				})
			}
		}
	}
</script>

<style lang="scss">
.product-view{
	padding: 15px 0;
	display: flex;
	flex-direction: column;
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
			width: 50px;
			height: 50px;
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
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.location{
					font-size: 14px;
					color: #666;
				}
				.fineness{
					background-color: #007AFF;
					color: white;
					padding: 5px;
					border-radius: 5px;
					font-size: 14px;
					font-weight: bold;
				}
			}
			.info{
				color: #666;
				text{
					padding-right: 5px;
				}
				.price{
					color: #007AFF;
					font-weight: bold;
					font-size: 14px;
				}
				.price-origin{
					color: $mk-base-color;
					text-decoration: line-through;
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
	}
	.comments-wrap{
		display: flex;
		flex-direction: column;
		padding-top: 20px;
		padding-bottom: 40px;
		.comments-title{
			margin-bottom: 10px;
		}
		.images{
			width: 100%;
			image{
				width: 100%;
				border-radius: 5px;
			}
		}
		.comment-item{
			width: 100%;
			padding: 10px 5px;
			margin: 0;
			border-bottom: solid 1px #f5f5f5;
			text{
				font-size: 13px;
				line-height: 20px;;
			}
		}
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
			justify-content: center;
			align-items: center;
			margin:0 15px;
			padding: 0 10px;
			width: 100%;
			height: 30px;
			border: solid 1px #ddd;
			background-color: #007AFF;
			border-radius: 5px;
			text{
				color: white;
				font-size: 14px;
			}
		}
	}
}

.popup-wrap{
	background-color: white;
	position: absolute;
	left: 0;
	right:0;
	bottom: 0;
	height: 350px;
	box-sizing: border-box;
	.area-head{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: solid 1px #f5f5f5;
		.head-item{
			height: 30px;
			line-height: 30px;
			padding: 0 15px;
			font-size: 18px;;
		}
		.btn-close{
			color: white;
			background-color: $mk-base-color;
			margin: 6px;
			height: 30px;
			line-height: 30px;
			border-radius: 10px;
			font-size: 14px;
		}
	}
	.content-editor{
		padding: 15px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.phone-btn{
			margin-bottom: 10px;
			display: flex;
			justify-content: center;
			text{
				font-size: 16px;
				color: white;
				background-color: #007AFF;
				font-weight: bold;
				text-align: center;
				padding: 10px;
				border-radius: 20px;
			}
		}
		.intro{
			width: 100%;
			height: 200px;
			font-size: 14px;
			overflow: hidden;
		}
	}
	.notes{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		color: $mk-base-color;
		line-height: 40px;
		border-top: dotted 1px #eeeeee;
	}
}
</style>
