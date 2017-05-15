/**

localStorage.getItem(key):获取指定key本地存储的值
localStorage.setItem(key,value)：将value存储到key字段
localStorage.removeItem(key):删除指定key本地存储的值
localStorage.clear() :清除所有键值
*/
function put(key,value){
	localStorage.setItem(key,value);
}
function get(key){
	return localStorage.getItem(key);
}
function clear(){
	localStorage.clear();
}
function removeItem(key){
	localStorage.removeItem(key);
}