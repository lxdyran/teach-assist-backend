var router = require("express")();
var ObjectId = require('mongoose').Types.ObjectId;
var moment = require('moment');
var postModel = require('../model/post');


//-------------------转义课程号------------------------
router.all('/:course_id', function(req, res, next) {
    try {
        req.params.course_id = ObjectId(req.params.course_id)
    } catch(err) {
        return next("课程号不存在！");
    }
    next();
});

//-------------------转义帖子号------------------------
router.all('/:course_id/:post_id', function(req, res, next) {
    try {
        req.params.post_id = ObjectId(req.params.post_id)
    } catch(err) {
        return next("帖子号不存在！");
    }
    next();
});

//---------------------防止越权------------------------
router.all('/:course_id', function(req, res, next) {
    var isMatch = false;
    req.users.courses.forEach(function(course_id) {
        if (course_id.equals(req.params.course_id)) {
            isMatch = true;
            return false;
        }
    });
    isMatch ? next() : next("您没有访问该课程的权限!");
});


//---------------------获取帖子列表--------------------
// {
//     "code": 0,
//     "posts": [
//     {
//         "_id": "56fa6aaf3d72f19c21058da2",
//         "updatedAt": "2016-03-29T11:44:47.846Z",
//         "createdAt": "2016-03-29T11:44:47.846Z",
//         "user_id": "56957522f7b3032a3c630da9",
//         "user_name": "张泉方",
//         "course_id": "5682725d60ff7eac1d73edeb",
//         "title": "lalala",
//         "content": "lololo",
//         "__v": 0,
//         "del": 0,
//         "top": 0,
//         "count_zan": 0,
//         "count_read": 0,
//         "parent": null
//     }
// ]
// }
router.get('/:course_id', function(req, res, next) {
    postModel.find({
        course_id: req.params.course_id,
        del: 0
    }).exec(function(err, posts) {
        if (err) return next(err);
        res.json({code: 0, posts: posts});
    });
});


//---------------------新增主题帖------------------------
// {
//     "code": 0,
//     "post": {
//     "__v": 0,
//         "updatedAt": "2016-03-29T11:45:00.912Z",
//         "createdAt": "2016-03-29T11:45:00.912Z",
//         "user_id": "56957522f7b3032a3c630da9",
//         "user_name": "张泉方",
//         "course_id": "5682725d60ff7eac1d73edeb",
//         "title": "lalala",
//         "content": "lololo",
//         "_id": "56fa6abc3d72f19c21058da3",
//         "del": 0,
//         "top": 0,
//         "count_zan": 0,
//         "count_read": 0,
//         "parent": null
// }
// }
router.post('/:course_id', function(req, res, next) {
    if (!req.body.title) return next("帖子标题不能为空！");
    if (!req.body.content)  return next("帖子内容不能为空！");
    postModel.create({
        user_id: req.users._id,
        user_name: req.users.realname,
        course_id: req.params.course_id,
        title: req.body.title,
        content: req.body.content
    }, function(err, post) {
        if (err) return next(err);
        res.json({code:0, post:post});
    });      
});

/*router.put('/:course_id', function(req, res) {
    var course_id = req.body.course_id;
    var newtitle = req.body.title;
    var newcontent = req.body.content;
    var result = {
        code: 0,
        desc: "success!"
    };
    if(newtitle===null || newcontent ===null)
    {
        result.code = 1;
        result.desc = "There is no update title or no update content!";
        res.json(result);
    }
    else{
        var promise = req.db.collection("posts").updateOne
        (
            { "_id":ObjectId(course_id)},
            { $set:{ "title":newtitle,"content":newcontent} }
        );
    }
    res.json(result);
});*/

router.delete('/:course_id/:post_id', function(req, res) {
    var id=req.query.post_id;
    var result = {
        code: 0,
        desc: "success!"
    };
    
    postModel.update({
        
    })
    req.db.collection("posts").deleteOne( { "_id":ObjectId(req.query.post_id) }).
        then(function(err)
            {res.json({code:1, desc:err.toString()})}
    );
    res.json(result);
});

module.exports = router;