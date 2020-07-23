<template>
	<view class="product-manager">
		<view class="product-manager">
			<form class="form product-form">
				<view class="uni-form-item">
					<input class="uni-input" v-model="topicForm.title" placeholder="必填: 吐槽标题" />
				</view>
				<view class="uni-form-item checkboxes-wrap">
					<view class="wrap-title">
						<text>吐槽对象</text>
					</view>
					<checkbox-group @change="checkboxChange">
						<label v-for="(tagText, idx) in tagsOfTopic" :key="idx">
							<checkbox :value="tagText" :checked="shallBeChecked(tagText)" />{{ tagText }}
						</label>
					</checkbox-group>
				</view>
				<view class="uni-form-item">
					<textarea class="uni-textarea" v-model="topicForm.content" placeholder="必填: 吐槽内容"></textarea>
				</view>
				
				<view class="images-wrap" v-if="topicForm.id">
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
					<view class="h-btn"><button @click.stop="onSaveTopic" type="primary" :loading="isInSavingProgress">保存</button></view>
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
			...mapGetters(['currentUser','tagsOfTopic'])
		},
		watch:{
			'uploadingImages':function(newList, oldList){
				if(newList.length > 0 && newList.length === this.images.length){
					// 表示上传完成了, 那就更新一下产品数据. 图片上传的异步进程全部完毕
					this._simpleTopicUpdate();
				}
			}
		},
		onLoad(query){
			const params = JSON.parse(query.params);
			this.loadTopicByUuid(params.id);
		},
		onShow(){
			if(this.tagsOfTopic.length === 0){
				this.$store.dispatch(
					'set_tags_of_topic',
					['初到澳洲','交友','工作','学习','渣男渣女','闲聊']
				);
			}
		},
		data() {
			return {
				topicForm:{
					id: null,
					uuid: '',
					title: '',
					tags: [],
					content: ''
				},
				images:[],
				isInSavingProgress: false,
				// 上传图片的缓存
				uploadingImages:[],
			};
		},
		methods: {
			// 这个方法只保存文字的内容
			onSaveTopic: function(){
				this.isInSavingProgress = true;
				if(Util.isEmpty(this.topicForm.id)){
					this._simpleTopicUpdate();
				} else {
					// 首先判断文件是否需要上传, 条件是: 只有一张图片
					const formData = {topic_id: this.topicForm.id};
					if(this.images.length > 0){
						for(let i=0;i<this.images.length;i++){
							const img = this.images[i];
							if(img.indexOf('blob:') === 0){
								// 表示需要上传
								uni.uploadFile({
									url: Util.buildTopicImageUploadUrl(),
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
							} else {
								this.uploadingImages.push(img);
							}
						}
					} else {
						this._simpleTopicUpdate();
					}
				}
			},
			_simpleTopicUpdate: function(){
				if(this.uploadingImages.length === this.images.length){
					for(let i=0;i<this.images.length;i++){
						this.images[i] = this.uploadingImages[i];
					}
				}
				
				Util.submitTopic(this.topicForm, this.currentUser.uuid, this.images).then(res => {
					if(Util.isAjaxResOk(res)){
						if(Util.isEmpty(this.topicForm.id)){
							this.topicForm.id = res.data.id;
							this.topicForm.uuid = res.data.uuid;
						}
						uni.showToast({
							title: '保存成功'
						});
					} else {
						uni.showToast({
							title: res.message
						});
					}
					this.isInSavingProgress = false;
				});
			},
			checkboxChange: function(e){
				this.topicForm.tags = e.detail.value;
			},
			shallBeChecked: function(text){
				return this.topicForm.tags.indexOf(text) > -1;
			},
			// 图片上传相关方法
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
			// 图片上传相关方法结束
			loadTopicByUuid: function(uuid){
				Util.loadTopicByUuidToEdit(uuid, this.currentUser.uuid).then(res => {
					if(Util.isAjaxResOk(res)){
						this.topicForm.id = res.data.topic.id;
						this.topicForm.uuid = uuid;
						this.topicForm.title = res.data.topic.title;
						this.topicForm.tags = res.data.topic.tags;
						this.topicForm.content = res.data.topic.content;
						this.images = res.data.topic.images;
					} else {
						uni.showToast({
							title:'话题已被删除'
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
				&.checkboxes-wrap{
					display: flex;
					flex-direction: column;
					background-color: white;
					padding: 10px;
					border-radius: 10px;
					width: 94%;
					uni-checkbox-group{
						uni-label{
							font-size: 14px;
							margin: 15px;
							uni-checkbox{
								transform:scale(0.7)
							}
						}
					}
					.wrap-title{
						font-size: 16px;
						color: $mk-base-color;
						font-weight: bold;
						margin-bottom: 10px;
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
					width: 100%;
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
