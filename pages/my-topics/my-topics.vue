<template>
	<view class="shop">
		<view class="shop-title">
			<text>我的吐槽</text>
		</view>
		<view class="products-wrap">
			<view class="products">
				<list-scroll :theTag="myTopics" @card-list-item-clicked="onTopicItemClicked">
					
				</list-scroll>
			</view>
		</view>
		<view class="toolbar">
			<view class="input-box" @click.stop="onAddTopic">
				<uni-icons type="plus" size="20" color="#ffffff"></uni-icons>
				<text>我要吐槽</text>
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
				return this.currentUser.uuid === this.currentShopOwnerUuid;
			}
		},
		onShow(){
			this.loadTopicsICreated();
		},
		data() {
			return {
				myTopics:{
					items:[],
					type:'topic',
					name:'mine',
				}
			};
		},
		methods:{
			onTopicItemClicked: function(payload){
				uni.navigateTo({
					url: Util.buildParamsWriteTopicPageUrl(payload.item.id)
				})
			},
			onAddTopic: function(){
				uni.navigateTo({
					url: Util.buildParamsWriteTopicPageUrl()
				})
			},
			loadTopicsICreated: function(){
				Util.topicsICreated(this.currentUser.id).then(res => {
					if(Util.isAjaxResOk(res)){
						this.myTopics.items = res.data.topics;
					}
				})
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
