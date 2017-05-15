// JavaScript Document
var MineMicroShop=function(){
	var mine_micro_shop = "0";
	this.mine_micro_shop_result=function(data){
		var server_code_info = data.codeInfo;
		var server_success_info = data.msgInfo;
		if(server_code_info!=null&&mine_micro_shop==server_code_info){
			this.mine_micro_shop_success_callback(data);
		}
	}
	this.mine_micro_shop_success_callback=function(data){
		var micro_url = data.pageURL;
		if(micro_url!=null&&micro_url.length>0){
			put(me_micro_shop,micro_url);
		}
	}
}