<template>
	<view>
		<view class="tab">
			<scroll-view scroll-x="true" class="tab-scroll">
				<view class="tab-scroll_box">
					<view v-for="(theTag, index) in tags" 
					:key="index" 
					class="tab-scroll_item" 
					@click="onTabClicked(index)"
					:class="{active:index === current}"
					>
						{{ theTag.name }}
					</view>
				</view>
			</scroll-view>
			<view class="tab-fixed-el">
				<uni-icons type="settings"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			tags:{
				type: Array,
				default(){
					return [];
				}
			},
			activeTabIndex:{
				type: Number,
				default(){
					return 0;
				}
			}
		},
		watch:{
			activeTabIndex: function(newVal){
				this.current = newVal;
			}
		},
		data() {
			return {
				current: 0,
			};
		},
		methods:{
			onTabClicked: function(idx) {
				this.current = idx;
				this.$emit('tab-clicked',{idx: idx})
			}
		}
	}
</script>

<style lang="scss">
.tab{
	background-color: white;
	border-bottom: 1px #f5f5f5 solid;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	.tab-scroll{
		flex: 1;
		overflow: hidden;
		box-sizing: border-box;
		.tab-scroll_box{
			display: flex;
			height: $default-bar-height;
			align-items: center;
			flex-wrap: nowrap;
			box-sizing: border-box;
			.tab-scroll_item{
				flex-shrink: 0; // 不可被挤压，压缩
				padding: 0 10px;
				font-size: 14px;
				color: #333333;
			}
			.active{
				color: $mk-base-color;
			}
		}
	}
	
	.tab-fixed-el{
		display: flex;
		justify-content: center;
		align-items: center;
		width: 45px;
		position: relative;
		&::after{
			content: '';
			position: absolute;
			top: 12px;
			bottom: 12px;
			left: 0;
			width: 1px;
			background-color: #ddd;
		}
	}
}
</style>
