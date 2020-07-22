<template>
	<view>
		个人主页
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
		onLoad(query) {
			const params = JSON.parse(query.params);
			// params.title = '';
			// params.content = '';
			// const keys = Object.keys(params);
			// keys.forEach(key => {
			// 	this.article[key] = params[key];
			// })
			console.log(params)
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
