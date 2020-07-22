<template>
	<view class="product-manager">
		<view class="product-manager">
			<form class="form product-form">
				<view class="uni-form-item">
					<input class="uni-input" v-model="product.name" placeholder="必填: 产品名" />
				</view>
				<view class="uni-form-item">
					<input class="uni-input" v-model="product.location" placeholder="必填: 卖家所在区域, 如TAS" />
				</view>
				<view class="price-holder">
					<view class="uni-form-item">
						<input class="uni-input" v-model="product.full_price" placeholder="必填: 产品原价" />
					</view>
					<view class="uni-form-item">
						<input class="uni-input" v-model="product.price" placeholder="必填: 卖出价" />
					</view>
				</view>
				<view class="uni-form-item slider-item">
					<view class="uni-title">商品状态: {{ product.fineness/10 }}成新</view>
					<slider v-model="product.fineness" @change="sliderChange" step="10" />
				</view>
				<view class="uni-form-item">
					<textarea class="uni-textarea" v-model="product.desc" placeholder="必填: 产品说明, 如品牌, 交付方式等"></textarea>
				</view>
				
				<view class="images-wrap" v-if="product.id">
					<view class="profile-subtitle">产品图片(最多6张)</view>
					<view class="profile-avatar-wrap">
						<view class="image-item" v-for="(img, index) in images" :key="index">
							<view class="close-icon" @click="deleteImage(index)">
								<uni-icons type="closeempty" size="16" color="white"></uni-icons>
							</view>
							<view class="the-image">
								<image :src="img" mode="aspectFill"></image>
							</view>
						</view>
						<view class="image-item" @click="addImage" v-if="images.length < 6">
							<view class="the-image">
								<uni-icons type="plusempty" size="50" color="#eeeeee"></uni-icons>
							</view>
						</view>
					</view>
				</view>
				
				<view class="uni-btn-v">
					<view class="h-btn"><button @click.stop="onSaveProduct" type="primary" :loading="isInSavingProgress">保存产品</button></view>
					<view class="h-btn"><button v-if="product.id" type="warn" @click.stop="deleteProduct">下架产品</button></view>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	import {mapGetters} from 'vuex';
	import Util from '../../common/utils.js';
	export default {
		computed:{
			...mapGetters(['currentUser','currentShopOwnerUuid']),
			isShopOwner: function(){
				return this.currentUser.uuid === this.currentShopOwnerUuid;
			}
		},
		onLoad(query){
			// 获取传递过来的参数, 实现部分数据的预加载
			const params = JSON.parse(query.params);
			const productId = parseInt(params.id);
			if(productId !==0){
				this.loadProduct(productId);
			} else {
				
			}
		},
		watch:{
			'uploadingImages':function(newList, oldList){
				if(newList.length > 0 && newList.length === this.images.length){
					// 表示上传完成了, 那就更新一下产品数据. 图片上传的异步进程全部完毕
					this._simpleProductUpdate();
				}
			}
		},
		data() {
			return {
				product:{
					id: null,
					name: '',
					price: '',
					full_price: '',
					desc: '',
					location: '',
					fineness: 70
				},
				images:[],
				isInSavingProgress: false,
				uploadingImages:[],
			};
		},
		methods:{
			loadProduct: function(id){
				console.log('Load product to manage', id);
				Util.loadProductById(id).then(res => {
					if(Util.isAjaxResOk(res)){
						this.product.id = res.data.product.id;
						this.product.name = res.data.product.name;
						this.product.price = res.data.product.price;
						this.product.full_price = res.data.product.full_price;
						this.product.desc = res.data.product.desc;
						this.product.location = res.data.product.location;
						this.product.fineness = res.data.product.fineness;
						this.images = res.data.product.images;
					}
				})
			},
			sliderChange: function(e){
				this.product.fineness = e.detail.value;
			},
			_simpleProductUpdate: function(){
				if(this.uploadingImages.length === this.images.length){
					for(let i=0;i<this.images.length;i++){
						this.images[i] = this.uploadingImages[i];
					}
				}
				Util.saveProductByUserUuid(this.product, this.images, this.currentUser.uuid)
				.then(res => {
					if(Util.isAjaxResOk(res)){
						this.product.id = res.data.id;
					}
					this.isInSavingProgress = false;
					this.uploadingImages = [];
				})
			},
			onSaveProduct: function(){
				this.isInSavingProgress = true;
				if(Util.isEmpty(this.product.id)){
					this._simpleProductUpdate();
				} else {
					// 首先判断文件是否需要上传, 条件是: 只有一张图片
					const formData = {product_id: this.product.id};
					if(this.images.length > 0){
						for(let i=0;i<this.images.length;i++){
							const img = this.images[i];
							if(img.indexOf('blob:') === 0){
								// 表示需要上传
								const uploadTask = uni.uploadFile({
									url: Util.buildProductImageUploadUrl(),
									header:{
										'Authorization': 'Bearer ' + this.currentUser.uuid
									},
									filePath: img,
									name: 'file',
									formData: formData,
									success: (res) => {
										if(res.statusCode === 200 && res.errMsg === 'uploadFile:ok'){
											const resData = JSON.parse(res.data);
											if(Util.isAjaxResOk(resData)){
												this.uploadingImages.push(resData.data.item[0].file.url);
											}
										}
									},
									fail: err => {console.log(err);}
								});
								uploadTask.onProgressUpdate( res => {
									this.uploadingProgress = res.progress;
									// console.log('上传进度' + this.uploadingProgress);
									// console.log('已经上传' + res.totalBytesSent);
									// console.log('总计需要上传' + res.totalBytesExpectedToSend);
								});
							} else {
								this.uploadingImages.push(img);
							}
						}
					} else {
						this._simpleProductUpdate();
					}
				}
			},
			deleteImage: function(idx){
				this.images.splice(idx, 1);
			},
			addImage: function(){
				let count = 6 - this.images.length;
				uni.chooseImage({
					count: count,
					sizeType:['original', 'compressed'],
					sourceType: ['album'],
					success: res =>{
						const tempFilePaths = res.tempFilePaths;
						if(tempFilePaths.length < count){
							count = tempFilePaths.length;
						}
						for(let i=0;i<count;i++){
							this.images.push(tempFilePaths[i]);
						}
					}
				})
			},
			// 下架产品
			deleteProduct: function(){
				Util.deleteProductById(this.product.id, this.currentUser.uuid).then(res => {
					if(Util.isAjaxResOk(res)){
						// 删除成功, 返回产品列表页
						uni.showToast({
							title: '产品: ' + this.product.name + '已被删除' 
						})
						uni.navigateTo({
							url: Util.buildParamsForHomeProductsPageUrl()
						})
					}else {
						uni.showToast({
							title: res.message
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #f5f5f5;
}
.product-manager{
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
	
	.product-manager{
		.form{
			display: flex;
			flex-direction: column;
			padding: 0 15px;
			box-sizing: border-box;
			
			.uni-form-item{
				width: 100%;
				margin-bottom: 10px;
				overflow: hidden;
				.uni-input{
					background-color: white;
					padding: 10px;
					border-radius: 10px;
					font-size: 14px;;
				}
				&.slider-item{
					display: flex;
					flex-direction: column;
					background-color: white;
					padding: 10px;
					border-radius: 10px;
					width: 94%;
					.uni-title{
						font-size: 14px;
					}
				}
				.uni-textarea{
					background-color: white;
					padding: 10px;
					border-radius: 10px;
					font-size: 14px;
					width: 94%;
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
		
			.price-holder{
				display: flex;
				flex-direction: row;
				.uni-form-item{
					&:first-child{
						padding-right: 3px;
					}
				}
			}
		}
	}
}

.images-wrap{
	background-color: white;
	padding: 5px;
	border-radius: 10px;
	margin-bottom: 10px;
	.profile-subtitle{
		font-size: 14px;
		margin: 5px 10px;
	}
	.profile-avatar-wrap{
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		.image-item{
			width: 33.33%;
			position: relative;
			height: 0;
			padding-top: 33.33%;
			box-sizing: border-box;
			.close-icon{
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				right: 0;
				top: 0;
				width: 22px;
				height: 22px;
				border-radius: 50%;
				background-color: $mk-base-color;
				z-index: 2;
			}
			.the-image{
				display: flex;
				justify-content: center;
				align-items: center;
				position: absolute;
				top: 5px;
				bottom: 5px;
				left: 5px;
				right: 5px;
				border: 1px solid #f5f5f5;
				border-radius: 5px;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>
