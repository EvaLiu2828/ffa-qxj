var DateUtils=function(){
	this.getYMD=function(){
		var nowDate = new Date();
		var year = nowDate.getFullYear();
		var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1)
		   : nowDate.getMonth() + 1;
		var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate
		   .getDate();
		var dateStr = year + "-" + month + "-" + day;
		return dateStr;
	}
	this.getTime=function(){
		
		return new Date().getTime();
	}
}
