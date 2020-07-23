<template>
	<view class="detail">
		<view class="title">
			<text>{{ article.title }}</text>
		</view>
		<view class="header">
			<view class="avatar" v-if="isNews">
				<image :src="article.picture" mode="aspectFill"></image>
			</view>
			<view class="header-content">
				<view class="author">{{ article.trend }}</view>
				<view class="info">
					<text v-if="isNews">
						浏览量: {{ article.traffic }}+
					</text>
					<text v-if="!isNews">
						已关注: {{ article.watches }}
					</text>
					<text v-if="!isNews">赞同: {{ article.thumb_up }}</text>
				</view>
				<view></view>
			</view>
		</view>
		<view class="content">
			<u-parse :content="article.content" :noData="noData"></u-parse>
			<view class="comments-wrap" v-if="comments && comments.length > 0">
				<view class="comments-title">
					<text style="color: #007AFF;">最新评论</text>
				</view>
				<view v-for="item in comments" :key="item.id">
					<comments-box :comment="item" type="news"></comments-box>
				</view>
			</view>
		</view>
		
		<view class="toolbar">
			<view class="input-box" @click.stop="onComment">
				<text>发表评论</text>
				<uni-icons type="compose" size="16" color="#f07373"></uni-icons>
			</view>
			<view class="icons-wrap" v-if="!isNews">
				<view class="icons-box" @click.stop="likeThis">
					<uni-icons :type="topicWatched ? 'heart-filled' : 'heart'" size="20" color="#f07373" ></uni-icons>
				</view>
				<view class="icons-box" @click.stop="thumbUpThis">
					<uni-icons :type="topicLiked ? 'hand-thumbsup-filled' : 'hand-thumbsup'" size="20" color="#f07373"></uni-icons>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-wrap">
				<view class="area-head">
					<view class="head-item btn-close" @click.stop="closeComment">
						<uni-icons size="14" color="#ffffff" type="close"></uni-icons>
						<text style="margin-left: 5px;">取消</text>
					</view>
					<view class="head-item submit-btn" @click.stop="submitComment">
						<text style="margin-right: 5px;">发布</text>
						<uni-icons size="14" color="#ffffff" type="chatboxes"></uni-icons>
					</view>
				</view>
				<view class="content-editor">
					<textarea class="content-input" v-model="comment" placeholder="留下你的精彩评论吧 ..." :fixed="true" :maxlength="200"></textarea>
					<view class="words-counter">{{ comment.length }}/200</view>
				</view>
				<view class="notes">
					<text>请注意保持礼貌, 尊重他人表达意见的权利</text>
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
		data() {
			return {
				article:{
					thumb_up: 0,
					watches: 0,
				},
				noData:'<p style="text-align:center;color:#666;">详情加载中 ...</p>',
				comments:[],
				comment:'', // 输入的评论内容
				topicWatched: false,
				topicLiked: false,
			};
		},
		onReady() {
			// 发表评论时的弹出层
			 // onLoad的时候，实际页面渲染没有完成, 因此这个能执行成功要依赖 onReady 回调
		},
		onLoad(query){
			// 获取传递过来的参数, 实现部分数据的预加载
			const params = JSON.parse(query.params);
			params.title = '';
			params.content = '';
			const keys = Object.keys(params);
			keys.forEach(key => {
				this.article[key] = params[key];
			})
			this.loadItemContent();
		},
		computed: {
			...mapGetters(['currentUser']),
			isNews: function(){
				return this.article.type.indexOf('news') > -1;
			}
		},
		methods:{
			loadItemContent: function() {
				Util.getContentById(this.article.id, this.article.type).then(res => {
					if(Util.isAjaxResOk(res)){
						this.article.title = res.data.item.title;
						this.article.thumb_up = res.data.item.thumb_up; // 赞同数
						this.article.watches = res.data.item.watches; // 赞同数
						this.article.content = '<div>' + res.data.item.content + '</div>';
						setTimeout((e)=>{
							this.comments = res.data.item.comments;
						},1000)
					}
				});
			},
			onComment: function(){
				this.$refs.popup.open();
			},
			closeComment: function(){
				this.$refs.popup.close();
			},
			submitComment: function(){
				if(this.comment.length === 0){
					uni.showToast({
						title:'请输入评论的内容'
					});
					return;
				}
				uni.showLoading({
					title:'正在发布中 ...'
				})
				Util.submitComment(this.comment, this.article.id, this.article.type).then(res => {
					if(Util.isAjaxResOk(res)){
						// 发布评论成功
						this.$refs.popup.close();
						uni.hideLoading();
						uni.showToast({
							title:'发布成功'
						});
						const theComment = res.data.item;
						theComment.u_name = '我';
						this.comments.unshift(theComment);
						this.comment = '';
					} else {
						uni.showToast({
							title:res.message
						})
					}
				});
			},
			likeThis: function(){
				if(Util.isEmpty(this.currentUser.uuid)){
					uni.showToast({
						title:'请先登录'
					});
					return;
				}
				if(!this.topicWatched){
					this.topicWatched = true;
					// 关注，成为发布者的朋友
					Util.watchTopic(this.article.id).then(res => {
						if(Util.isAjaxResOk(res)){
							uni.showToast({
								title:'谢谢关注'
							});
							this.article.watches++;
						} else {
							uni.showToast({
								title:res.message
							});
						}
					});
				}
			},
			thumbUpThis: function(){
				// 点赞
				if(this.topicLiked){
					return;
				}
				this.topicLiked = true;
				Util.thumbUpTopic(this.article.id).then(res => {
					if(Util.isAjaxResOk(res)){
						uni.showToast({
							title:'谢谢点赞'
						});
						this.article.thumb_up++;
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
.detail{
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
				color: $mk-base-color;
			}
			.info{
				color: #999;
				text{
					padding-right: 5px;
				}
				.highlight{
					color: $mk-base-color;
					font-weight: bold;
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
		padding: 20px;
		padding-bottom: 40px;
		border-top: solid 1px #f5f5f5;
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

.popup-wrap{
	background-color: white;
	position: absolute;
	left: 0;
	right:0;
	bottom: 0;
	height: 320px;
	box-sizing: border-box;
	.area-head{
		display: flex;
		justify-content: space-between;
		font-size: 14px;
		color: #666;
		border-bottom: solid 1px #f5f5f5;
		.head-item{
			height: 50px;
			line-height: 50px;
			padding: 0 15px;
		}
		.btn-close{
			color: white;
			background-color: $mk-base-color;
			margin: 6px;
			height: 30px;
			line-height: 30px;
			border-radius: 10px;
		}
		.submit-btn{
			color: white;
			background-color: #007AFF;
			margin: 6px;
			height: 30px;
			line-height: 30px;
			border-radius: 10px;
		}
	}
	.content-editor{
		padding: 15px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.content-input{
			width: 100%;
			height: 200px;
		}
		.words-counter{
			display: flex;
			justify-content: flex-end;
			font-size: 12px;
			color: #999;
		}
	}
	.notes{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 12px;
		color: #999999;
		line-height: 30px;
		border-top: dotted 1px #eeeeee;
	}
}
</style>
