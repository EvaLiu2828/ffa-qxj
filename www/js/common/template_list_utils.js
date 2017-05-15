var TemplateListUtils=function(){
	this.categoryName=function(n){
		var category;
		if(n==001){
			category="特别企划";
		}
		if(n==002){
			category="信贷与综合";
		}
		if(n==003){
			category="宜人贷";
		}
		if(n==004){
			category="宜车贷";
		}
		if(n==005){
			category="宜房贷";
		}
		if(n==006){
			category="客户故事";
		}
		if(n==007){
			category="宜信品牌";
		}
		if(n==008){
			category="媒体报道";
		}
		if(n==009){
			category="客户指导";
		}
        if(n==010){
            category="普惠学习";
        }
        if(n==011){
            category="宜信之声";
        }
		return category;
	}
	
}
