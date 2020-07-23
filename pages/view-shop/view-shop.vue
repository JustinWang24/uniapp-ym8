<template>
	<view class="shop">
		<view class="shop-title">
			<text>{{ theProducts.name }}</text>
		</view>
		<view class="products-wrap">
			<view class="products">
				<list-scroll :theTag="theProducts" @card-list-item-clicked="onProductItemClicked">
					
				</list-scroll>
			</view>
		</view>
		<view class="toolbar" v-if="!isShopOwner && currentUser.uuid">
			<view class="input-box" @click.stop="onSaveAsFavorite">
				<uni-icons type="heart" size="20" color="#ffffff"></uni-icons>
				<text>关注店长</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	import Util from '../../common/utils.js';
	
	export default {
		computed:{
			...mapGetters(['currentUser']),
			isShopOwner: function(){
				return this.currentUser.uuid === this.ownerUuid;
			}
		},
		onLoad(query){
			// 获取传递过来的参数, 实现部分数据的预加载
			const params = JSON.parse(query.params);
			this.ownerUuid = params.ownerUuid;
			this.loadProductsByUserUuid(this.ownerUuid);
			this.currentPageIndex = 0;
		},
		data() {
			return {
				theProducts:{
					items:[],
					name:'二手商店',
					type:'topic_buy',  // 这个是固定的key
				},
				currentPageIndex: 0, // 当前的index
				currentShopOnwner: null,
				ownerUuid:null
			};
		},
		methods:{
			loadProductsByUserUuid: function(uuid){
				if(!Util.isEmpty(uuid)){
					Util.loadProductsByUserUuid(uuid, this.currentPageIndex)
					.then(res => {
						if(Util.isAjaxResOk(res)){
							// 商品加载成功
							this.theProducts.name = res.data.owner.name + '的二手商店';
							this.currentShopOnwner = res.data.owner;
							this.theProducts.items = res.data.products;
						}
					})
				}
			},
			onProductItemClicked: function(payload){
				// 如果是别人的商品, 那么显示的是购买或者卖家的页面
				uni.navigateTo({
					url: Util.buildParamsForViewProductPageUrl(payload.item.id)
				});
			},
			onSaveAsFavorite: function(){
				// 跳转到添加产品的页面
				// 关注，成为发布者的朋友
				Util.watchUser(this.ownerUuid).then(res => {
					if(Util.isAjaxResOk(res)){
						uni.showToast({
							title:'谢谢关注'
						});
						// this.article.watches++;
					} else {
						uni.showToast({
							title:res.message
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		height: 100%;
		display: flex;
	}
	.shop{
		display: flex;
		height: 100%;
		flex-direction: column;
		flex: 1;
		box-sizing: border-box;
		.shop-title{
			text-align: center;
			font-size: 20px;
			color: $mk-base-color;
			margin-top: 8px;
		}
		.products-wrap{
			flex: 1;
			.products{
				height: 100%;
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
			background-color: $mk-base-color;
			box-sizing: border-box;
			.input-box{
				display: flex;
				justify-content: center;
				align-items: center;
				margin-left: 10px;
				padding: 0 10px;
				width: 100%;
				height: 30px;
				text{
					color: #fff;
					font-size: 18px;
					font-weight: bold;
					padding-left: 4px;
				}
			}
		}
	}
</style>
