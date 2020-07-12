<template>
	<view @click.stop="onLikeClicked">
		<uni-icons :size="size" color="#f07373" :type="clicked?'heart-filled':'heart'"></uni-icons> {{ item.traffic }}+
	</view>
</template>

<script>
	export default {
		props:{
			size:{
				type: String,
				default: '12'
			},
			item:{
				type: Object,
				default:{}
			}
		},
		data() {
			return {
				clicked: false,
			};
		},
		methods: {
			onLikeClicked: function(){
				if(!this.clicked){
					this.clicked = true;
					// Todo: 处理提交到服务器的申请
				}
			}
		}
	}
</script>

<style lang="scss">

</style>
