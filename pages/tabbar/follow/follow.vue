<template>
	<view class="follow">
		<view class="follow-tab">
			<view class="box">
				<view @click="tabClicked(1)" class="follow-item" :class="{active:activeIndex === 1}">话题</view>
				<view @click="tabClicked(2)" class="follow-item" :class="{active:activeIndex === 2}">好友</view>
			</view>
		</view>
		<view class="followed-list">
			<swiper class="followed-list-wrap">
				<swiper-item>
					<view class="swiper-item">
						<list-scroll :theTag="myTopic" @card-list-item-clicked="onTopicListItemClicked">
							
						</list-scroll>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<list-scroll :theTag="myGroup" @card-list-item-clicked="onGroupListItemClicked">
							
						</list-scroll>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 1,
				myTopic:{
					type:'topic',
					items:[]
				},
				myGroup:{
					type:'person',
					items:[]
				}
			}
		},
		methods: {
			tabClicked: function(idx){
				this.activeIndex = idx;
			},
			onTopicListItemClicked: function(payload){
				
			},
			onGroupListItemClicked: function(payload){
				
			}
		}
	}
</script>

<style lang="scss">
page{
	height: 100%;
	display: flex;
}
.follow{
	display: flex;
	height: 100%;
	flex-direction: column;
	flex: 1;
	box-sizing: border-box;
	.follow-tab{
		height: 30px;
		padding: 10px 20px;
		border-bottom: solid 1px #f5f5f5;
		.box{
			width: 100%;
			height: 100%;
			display: flex;
			border-radius: 5px;
			border: solid 1px $mk-base-color;
			.follow-item{
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				font-size: 14px;
				color: #666;
				&:first-child{
					border-right: solid 1px $mk-base-color;
				}
				&.active{
					color: $mk-base-color;
				}
			}
		}
	}
	
	.followed-list{
		flex: 1;
		.followed-list-wrap{
			height: 100%;
			.swiper-item{
				
			}
		}
	}
}
</style>
