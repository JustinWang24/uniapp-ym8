<template>
	<swiper class="home-swiper" :current="current" @change="onChange">
		<!-- 新闻列表 -->
		<swiper-item class="swiper-item" v-for="(theTag, theTagIndex) in localTags" :key="theTagIndex">
			<list-scroll 
				class="swiper-item-list" 
				:theTag="theTag" 
				@card-list-item-clicked="onCardListItemClicked">
			</list-scroll>
		</swiper-item>
	</swiper>
</template>

<script>
	/* theTag的结构: name=>'tag名称',type=>'包含的内容类型',items=>[包含的内容对象列表] */
	import Util from '../../common/utils.js';
	export default {
		props:{
			tags:{
				type: Array,
				default:[]
			},
			currentTagIndex:{ // 默认高亮的tag索引值
				type: Number,
				default:0
			}
		},
		watch:{
			currentTagIndex: function(newVal, oldVal){
				this.current = newVal;
			},
			tags: function(newTags, oldVal){
				const ts = Util.cloneObject(newTags);
				const keys = Object.keys(ts);
				keys.forEach(key => {
					this.localTags.push(ts[key]);
				})
			}
		},
		data() {
			return {
				localTags:[], // tags传来的是初始值, 将其放到本地, 然后就可以随意修改了
				current: 0
			};
		},
		methods:{
			onChange: function(e){
				this.$emit('tag-changed',{newIndex: e.detail.current});
			},
			onCardListItemClicked: function(payload){
				if(payload.type === 'product'){
					uni.navigateTo({
						url: Util.buildParamsForViewProductPageUrl(payload.item.id)
					});
				} else if(payload.type === 'person'){
					console.log('交友')
				} else {
					uni.navigateTo({
						url: Util.buildParamsForHomeDetailPageUrl(payload)
					});
				}
			}
		}
	}
</script>

<style lang="scss">
.home-swiper{
	height: 100%;
	display: flex;
	.swiper-item{
		height: 100%;
		overflow: hidden;
		.swiper-item-list{
			height: 100%;
		}
		.no-content-wrap{
			text-align: center;
			padding-top: 20px;
			.no-content-tip{
				color: #C8C7CC;
				line-height: 1.5;
			}
		}		
	}
}
</style>
