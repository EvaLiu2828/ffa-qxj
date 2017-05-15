//FFA.config = {};
/**
 * indexedDB配置
 */
var indexedDB_config = {
    keepDataDb:"creditease_keep_data_db_1",//红点单独创建数据库
	DBNameOld : 'creditease_ffa_y1_v162',	//老的数据库版 删除上一版本
	DBName : 'creditease_ffa_v170',	//数据库名称
    frameNoRedDotVerion:1,//frame的版本号
	DBVersion : 12,									//修改本地库表结构将此项+1
	verStorageName : 'creditease_ffa_ver',		//版本库,记录本地库版本号
	cusStorageName : 'creditease_ffa_customer', 	//客户表
	tmplStorageName : 'creditease_ffa_template', //模板表
	hotQueryName:'creditease_ffa_hot_query',	//热点表
	cellInfoName:'creditease_ffa_cell_info', //个人信息
    noReadFrameTmplate:"creditease_ffa_no_read_tmplate", //未读标记
	rateInfoName:'creditease_ffa_rate_info', //普惠金融师评级信息
	tmplMenuListName: 'creditease_ffa_template_menu_list', // 模板菜单列表
	tmplCategoryStorageName:'creditease_ffa_template_category', // 模板分类表
	smsTmpName:'creditease_ffa_sms_template',//短信模板表
	performInfoName:'creditease_ffa_perform_info',//绩效查询表
	salerCustomerStorage: 'creditease_ffa_saler_customer',  // 销售列表
	verSalerCustomerStorage: 'creditease_ffa_saler_customer_ver', // 销售列表版本表
	teamCustomerStorage: 'creditease_ffa_team_customer', // 团队经理以及团队经理下的客户经理列表
	customerProgressStorage: 'creditease_ffa_customer_progress', //客户经理进度表
	teamProgressStorage: 'creditease_ffa_team_progress', //团队经理进度表
	teamProgressSalerStorage: 'creditease_ffa_team_progress_saler', //团队经理进度-销售列表
	//----start by ly-----
	coinInfoName:'creditease_ffa_coin_info',//指尖币信息表
	//----end by ly-----
	//----start by lyx-----
	qsjHotQuerName:"creditease_ffa_qsj_hot_query"  //抢商机热点表
	//----end by lyx-----
};
