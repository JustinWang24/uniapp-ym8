<template>
	<view class="comment-item">
		<view class="title">
			<text>{{ comment.u_name ? comment.u_name : '匿名用户' }} 发布于 {{ comment.created_at }}</text>
		</view>
		<view class="desc">
			<text>{{ comment.content }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			comment:{
				type:Object,
				default:{}
			},
			type:{
				type: String,
				default:'news'
			}
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
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
</style>
