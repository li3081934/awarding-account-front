var $ = require('node').all
var XTemplate = require("kg/xtemplate/3.3.3/runtime")
var articleView = require('./article-view')
var Bidi = require('gallery/bidi/1.3/')
require('./article.css')
module.exports = {
    init: function () {
        var containerTpl = new XTemplate(articleView)
        var containerHtml = containerTpl.render({})
        $('article').html(containerHtml)

        //准备数据
        var reviewData={
            projects:[
                {
                    id: 'project1',
                    name: '新型IP移动网络时间同步及回传网络地面定时传送技术研究及应用',
                    review: '审查意见12412',
                    status: 'checking',
                    account: {
                        id: 'account1'
                        , name: '提交人1'
                    },
                    detector: {
                        id: 'detector1'
                        , name: '审查人1'
                    }
                }
                , {
                    id: 'project2',
                    name: '多接入网络协同和融合”3项ITU-T国际标准',
                    review: '审查意见',
                    status: 'pass',
                    account: {
                        id: 'account2'
                        , name: '提交人2'
                    },
                    detector: {
                        id: 'detector2'
                        , name: '审查人2'
                    }
                }
                , {
                    id: 'project3',
                    name: '《基于语义的物联网需求和框架》等16项ITU国际标准/企业标准/行业标准',
                    review: '审查意见',
                    status: 'returned',
                    account: {
                        id: 'account3'
                        , name: '提交人3'
                    },
                    detector: {
                        id: 'detector3'
                        , name: '审查人3'
                    }
                }
            ],
            handle:{
                checkPass:function(e,data){
                    //console.log(data)
                    alert('pass')
                    this.set('status','pass',data)
                    //console.log(this.get('projects'))
                },
                checkNoPass:function(e,data){
                    //console.log(data)
                    alert('returned')
                    this.set('status','returned',data)

                },
                editReview:function(e,data){
                    var pID=data.id
                    var textA=$('textarea[name='+pID+']')
                    if(textA.hasAttr('readonly')){
                        textA.removeAttr('readonly')
                        e.target.innerText='保存意见'
                    }else{
                        //回掉执行下面
                        this.set('review',textA.val(),data)
                        textA.attr('readonly','readonly')
                        e.target.innerText='编辑意见'

                    }

                }
            }
        }
        Bidi.active(['action', 'class', 'attr', 'text', 'click', 'value'])
        function inviteText(isInvite){
            return parseInt(isInvite) ? "已邀请"  : "邀请";
        }
        //注册个助手方法
        Bidi.pipe('inviteText', inviteText);
        Bidi.xbind('reviewList',reviewData,reviewData.handle,containerHtml)
        Bidi.init()


    }
}