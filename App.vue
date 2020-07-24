<script>
	import {mapState} from 'vuex';
	import Util from 'common/utils.js';
	
	export default {
		computed:{
			...mapState(['userProfile'])
		},
		onLaunch: function() {
			// console.log('App Launch 只在全局触发一次的生命周期方法');
			// console.log('尝试加载用户的数据');
			const userId = this.userProfile.uuid;
			if(!Util.isEmpty(userId)){
				Util.getUserProfile(userId).then(res => {
					if(Util.isAjaxResOk(res)){
						// 表示获取用户profile成功
						this.$store.dispatch(
							'set_user_profile', // Action 中的方法名
							res.data.profile // Action 的方法的第二个参数
						);
					} else {
						// 表示没有取得用户的数据, 即没有登录
					}
				});
			}
		},
		onShow: function() {
			// 从后台进入前台, 应该尝试加载一下用户的基本数据
		},
		onHide: function() {
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import 'components/gaoyia-parse/parse.css';
</style>
