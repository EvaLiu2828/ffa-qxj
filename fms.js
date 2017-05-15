/**
 * Created by v-qizhongfang on 2015/12/7.
 *
 * Front-end Mock Server
 */
var fms = require('fms');

fms.run();

fms.ajax({
    type: 'get',
    title: '获取用户名',
    request: {
        id: '2',
        _id: "用户ID"
    },
    url: '/get_user/',
    res: {
        ok: {
            status: "success",
            username: "fms"
        },
        err: {
            status: "error",
            msg: "请先登录"
        }
    }
});

fms.ajax({
    type: 'get',
    title: "res",
    url: "/res/",
    request: {
        id: 1,
        _id: '用户ID'
    },
    res: {
        ok: false,
        err: false,
        string: "abcdef",
        object: {
            name: 'fms'
        },
        array: [1, 2, 3],
        fn: function (req) {
            var time = new Date().getTime()
            return {
                path: req.path,
                GET: req.query,
                time: time
            }
        }
    }
});