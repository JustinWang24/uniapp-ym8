<template>
	<view>
		<view class="profile-subtitle">我的头像</view>
		<view class="profile-avatar-wrap">
			<view class="image-item" v-for="(img, index) in imagesList" :key="index">
				<view class="close-icon" @click="deleteImage(index)">
					<uni-icons type="closeempty" size="16" color="white"></uni-icons>
				</view>
				<view class="the-image">
					<image :src="img" mode="aspectFill"></image>
				</view>
			</view>
			<view class="image-item" @click="addImage">
				<view class="the-image">
					<uni-icons type="plusempty" size="50" color="#eeeeee"></uni-icons>
				</view>
			</view>
		</view>
		<view class="profile-intro">
			<input v-model="name" placeholder="更新我的昵称" />
		</view>
		<view class="profile-intro">
			<input v-model="phone" placeholder="更新我的电话" />
		</view>
		<view class="profile-intro">
			<input v-model="newPassword" placeholder="更新我的登录密码" />
		</view>
		<view class="profile-intro">
			<textarea class="intro-input" v-model="intro" placeholder="一句话介绍一下自己吧(选填)"></textarea>
		</view>
		<button class="btn-submit" type="primary" @click="submitProfile" :loading="isSaving">保存</button>
	</view>
</template>

<script>
	import Constants from '../../common/constants.js';
	import Util from '../../common/utils.js';
	import {mapGetters} from 'vuex';
	
	export default {
		computed:{
			...mapGetters(['currentUser']),
		},
		onLoad() {
			if(!Util.isEmpty(this.currentUser.avatar)){
				this.imagesList.push(this.currentUser.avatar);
			}
			this.intro = this.currentUser.intro;
			this.name = this.currentUser.name;
			this.phone = this.currentUser.phone;
		},
		data() {
			return {
				imagesList:[],
				intro:'',
				newPassword:'',
				name:'', // 用户的昵称
				phone:'', // 用户的昵称
				uploadingProgress: 0,
				isSaving: false,
			};
		},
		methods:{
			addImage: function(){
				const count = Constants.MAX_FILE_UPLOADS_COUNT - this.imagesList.length;
				uni.chooseImage({
					count: count,
					// sizeType:['original', 'compressed'],
					// sourceType: ['album'],
					success: res =>{
						const tempFilePaths = res.tempFilePaths;
						if(this.imagesList.length === 1){
							this.imagesList.splice(0, 1);
						}
						this.imagesList.push(tempFilePaths[0]);
					}
				})
			},
			deleteImage: function(idx){
				this.imagesList.splice(idx, 1);
			},
			submitProfile: function(){
				this.isSaving = true;
				// 首先判断文件是否需要上传, 条件是: 只有一张图片
				const formData = {
					name: this.name,
					intro: this.intro,
					phone: this.phone,
					new_password: this.newPassword,
				};
				if(this.imagesList.length > 0){
					const img = this.imagesList[0];
					if(img.indexOf('blob:') === 0){
						// 表示需要上传
						uni.uploadFile({
							url: Util.buildImageUploadUrl(),
							header:{
								'Authorization': 'Bearer ' + this.currentUser.uuid
							},
							filePath: img,
							name: 'file',
							formData: formData,
							success: res => {
								if(res.statusCode === 200 && res.errMsg === 'uploadFile:ok'){
									const resData = JSON.parse(res.data);
									console.log(resData);
									if(Util.isAjaxResOk(resData)){
										this.$store.dispatch('set_user_profile',this._prepareProfileData(resData.data.item[0].file.url));
										uni.showToast({
											title:'保存成功'
										})
									} else {
										uni.showToast({
											title: resData.message
										})
									}
								}
								this.isSaving = false;
							},
							fail: err => {
								this.isSaving = false;
							}
						});
					} else {
						this.justUpdateProfile(formData);
					}
				} else {
					this.justUpdateProfile(formData);
				}
			},
			justUpdateProfile: function(formData){
				// 表示没有更新图片Avatar, 仅仅更新简介即可
				Util.updateMyProfile(formData).then(res => {
					if(Util.isAjaxResOk(res)){
						this.$store.dispatch('set_user_profile',this._prepareProfileData(false));
						uni.showToast({
							title: '保存成功'
						});
					}
					this.isSaving = false;
				});
			},
			_prepareProfileData: function(withImage){
				if(withImage){
					return {
						avatar: withImage,
						intro: this.intro,
						phone: this.phone,
						name: this.name,
					};
				} else {
					return {
						intro: this.intro,
						phone: this.phone,
						name: this.name,
					};
				}
			}
		}
	}
</script>

<style lang="scss">
.profile-subtitle{
	margin: 15px;
	margin-bottom: 0;
	font-size: 15px;
	color: #666;
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

.profile-intro{
	margin: 15px;
	padding: 10px;
	border: solid 1px #f5f5f5;
	border-radius: 8px;
	
	.intro-input{
		font-size: 14px;
		width: 100%;
		height: 100px;;
	}
}
.btn-submit{
	margin: 15px;
}
</style>
