// JavaScript Document
function NetUtils() {
	this.isHaveNet = function() {
		var networkState = navigator.network.connection.type; //获取网络的类型
		if (networkState == Connection.NONE) {
			return false
		}
		return true;
	}
}