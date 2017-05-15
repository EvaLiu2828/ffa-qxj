/**
 * Created by v-qiandong on 2015/11/4.
 */
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}