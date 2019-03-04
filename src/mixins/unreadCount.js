import wepy from 'wepy'

export default class unreadCount extends wepy.mixin{
	data = {
		// 轮询
    	interval: null,
    	// 未读消息数
    	unreadCount: 0
	}

	// 页面显示 开启轮询，每 30 秒执行一次
	onShow(){
		this.updateUnreadCount()
		this.interval = setInterval(()=>{
			this.updateUnreadCount()
		},30000)
	}

	// 页面隐藏
	onHide(){
		// 关闭轮询
		clearInterval(this.interval)
	}

	// 设置未读消息数
	// 用来同步全局变量中的 unreadCount
	updateUnreadCount(){
		// 从全局获取未读消息数
		this.unreadCount = this.$parent.globalData.unreadCount
		this.$apply()

		if(this.unreadCount){
			// 设置 badge
			wepy.setTabBarBadge({
				index: 1,
				text: this.unreadCount.toString()
			})
		}else{
			// 移除 badge
			wepy.removeTabBarBadge({
				index: 1
			})
		}
	}
}