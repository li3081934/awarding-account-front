var $ = require('node').all
var XTemplate = require("kg/xtemplate/3.3.3/runtime")
var Bidi = require('gallery/bidi/1.3/')
var Auth = require('kg/auth/2.0.6/')
var AuthMsgs = require('kg/auth/2.0.6/plugin/msgs/')
var overlay = require('overlay')
var IO = require('io')
var SP = require('core-front/smartPath/smartPath')
var PG = require('kg/pagination/2.0.0/index')
var JSONX = require('core-front/jsonx/jsonx')
var inviteView = require('./expertInvite-view')
require('kg/auth/2.0.6/plugin/msgs/style.css')
require('./expertInvite.css')
module.exports = {
    init: function (p) {
        IO.post(SP.resolvedIOPath('expert/initExpertInvite?_content=json'),
            {},
            function (d) {
                d = JSONX.decode(d)
                var task = d.data[0]
                var experts = d.data[1]
                IO.post(SP.resolvedIOPath('expert/initExpertInvite2?_content=json'),
                    {},
                    function (d2) {
                        d2 = JSONX.decode(d2)
                        var invitedExperts = d2.data
                        var TASK = task
                        var EXPERT_INVITE = {
                            task: task
                            , data: [{expertName: '范济安', expertPart: '北京分公司', isInvite: "1"}, {
                                expertName: '陈淑平',
                                expertPart: '天津分公司',
                                isInvite: "0"
                            }, {expertName: '哈特我', expertPart: '北京分公司', isInvite: "0"}]
                            , InvitedData: [{
                                expertName: '范济安',
                                expertPart: '北京分公司',
                                isEmail: '1',
                                isConfirm: '0'
                            }]
                            , openWindow: "1"
                            , experts: experts.pageItems
                            , invitedExperts: invitedExperts.pageItems
                            , handle: {
                                inviteExpert: function (e, data) {
                                    //if (data.isInvite == '0') {
                                    //    //发ajax请求回掉函数里执行this.set  到 this.add（添加到右侧列表）
                                    //    this.set('isInvite', '1', data)
                                    //    e.target.innerText = '已邀请'
                                    //    data.isEmail = '0'
                                    //    data.isConfirm = '0'
                                    //    this.add(data, 'InvitedData')
                                    //}
                                    var _this = this
                                    IO.post(SP.resolvedIOPath('expert/inviteExpert?_content=json'),
                                        {
                                            pageNo: invitePagination2.get('currentPage')
                                            , expertId: data.id
                                            , taskId: task.id
                                        },
                                        function (d) {
                                            if (d.flag) {
                                            d = JSONX.decode(d)
                                            EXPERT_INVITE.invitedExperts = d.data.pageItems
                                            EXPERT_INVITE.handle.reRenderInvitedExpert(data, _this)
                                            invitePagination2.set('totalPage', d.data.maxPageNum)
                                            invitePagination2.set('currentPage', d.data.maxPageNum)
                                            invitePagination2.renderUI()
                                            //在这里处理experts中的数据，修改相关专家的邀请状态
                                            var experts = _this.get('experts')
                                            for (var i = 0; i < experts.length; i++) {
                                                if (experts[i].id == data.id) {
                                                    //experts[i].taskExpert = []
                                                    for (var j = 0; j < EXPERT_INVITE.invitedExperts.length; j++) {
                                                        if (EXPERT_INVITE.invitedExperts[j].id == experts[i].id) {
                                                            experts[i].taskExpert = EXPERT_INVITE.invitedExperts[j].taskExpert
                                                            break
                                                        }
                                                    }
                                                    break
                                                }
                                            }
                                                _this.set('experts', experts)
                                            }
                                        }, "json")
                                }
                                , addExpert: function (data) {
                                    var expertName = $('#expertName').val(),
                                        expertEmail = $('#expertEmail').val(),
                                        expertPart = $('#expertPart').val()


                                    //发ajax请求回掉函数里执行this.add
                                    this.add({
                                        expertName: expertName,
                                        expertPart: expertPart,
                                        expertEmail: expertEmail,
                                        isEmail: '0',
                                        isConfirm: '0'
                                    }, 'data')
                                    //清空标签   关闭窗口
                                    $('#expertName').val(''), expertEmail = $('#expertEmail').val(''), expertPart = $('#expertPart').val('')
                                    this.set('openWindow', '1', data)

                                }
                                , sendEmail: function (e, data) {
                                    if (data.isEmail == '0') {
                                        //发ajax请求回掉函数里执行this.set   和 e.target.innerText='再发送'
                                        this.set('isEmail', '1', data)
                                        e.target.innerText = '再发送'
                                    }
                                }
                                , confirmExpert: function (e, data) {
                                    if (data.isConfirm == '0') {
                                        //发ajax请求回掉函数里执行this.set   和 e.target.innerText='已确认'
                                        this.set('isConfirm', '1', data)
                                        e.target.innerText = '已确认'
                                    }
                                }
                                , InvitedDel: function (data) {
                                    var _this = this
                                    IO.post(SP.resolvedIOPath('expert/unInviteExpert?_content=json'),
                                        {
                                            pageNo: invitePagination2.get('currentPage')
                                            , expertId: data.id
                                        },
                                        function (d) {
                                            d = JSONX.decode(d)
                                            EXPERT_INVITE.invitedExperts = d.data.pageItems
                                            EXPERT_INVITE.handle.reRenderInvitedExpert(data, _this)
                                            invitePagination2.set('totalPage', d.data.maxPageNum)
                                            invitePagination2.renderUI()
                                            //在这里处理experts中的数据，修改相关专家的邀请状态
                                            var experts = _this.get('experts')
                                            for (var i = 0; i < experts.length; i++) {
                                                if (experts[i].id == data.id) {
                                                    experts[i].taskExpert = []
                                                    break
                                                }
                                            }
                                            _this.set('experts', experts)
                                        }, "json")
                                }
                                , overlayShow: function (data) {
                                    //overlay.show()
                                    //overlay.on('afterRenderUI',function(){
                                    //    var auth = new Auth('#J_Auth');
                                    //    auth.plug(new AuthMsgs());
                                    //    auth.render();
                                    //
                                    //
                                    //    $('#closeOverlay').on('click',function(){
                                    //        overlay.hide()
                                    //    })
                                    //    $('#subExpertForm').on('click',function(){
                                    //        var expertName=$('#expertName').val(),
                                    //            expertEmail=$('#expertEmail').val(),
                                    //            expertPart=$('#expertPart').val()
                                    //        this.addExpert(expertName)
                                    //    })
                                    //
                                    //})
                                    //$('#closeOverlay').on('click',function(){
                                    //    overlay.hide()
                                    //})
                                    //$('#subExpertForm').on('click',function(){
                                    //    this.attributes.handle.addExpert()
                                    //}.bind(this))
                                    this.set('openWindow', '0')
                                }    //打开弹窗
                                , overlayHide: function (data) {
                                    this.set('openWindow', '1', data)
                                }    //关闭弹窗
                                , reRenderExpert: function (data) {
                                    this.set('experts', EXPERT_INVITE.experts)

                                    //this.add([{
                                    //    account: {
                                    //        name: 'a'
                                    //    }
                                    //}], 'experts')
                                }
                                , reRenderInvitedExpert: function (data, _this) {
                                    if (_this != null) {
                                        _this.set('invitedExperts', EXPERT_INVITE.invitedExperts)
                                    } else {
                                        this.set('invitedExperts', EXPERT_INVITE.invitedExperts)
                                    }
                                }
                            }
                        }
                        var inviteHtml = new XTemplate(inviteView).render({})
                        p.node.html(inviteHtml)
                        Bidi.active(['action', 'class', 'attr', 'text', 'click', 'value'])
                        Bidi.xbind('expertInviteList', EXPERT_INVITE, EXPERT_INVITE.handle, inviteHtml)
                        var getTaskExpertStatus = function (taskExpert) {
                            return taskExpert[0].status
                        }
                        Bidi.pipe('getTaskExpertStatus', getTaskExpertStatus);
                        Bidi.init()
                        var invitePagination = new PG($('#expertInvitePaginationContainer'), {
                            currentPage: 1, // 默认选中第?页
                            totalPage: experts.maxPageNum, // 一共有?页
                            firstPagesCount: 0, // 显示最前面的?页
                            preposePagesCount: 0, // 当前页的紧邻前置页为?页
                            postposePagesCount: 0, // 当前页的紧邻后置页为?页
                            lastPagesCount: 0, // 显示最后面的?页
                            render: true
                        })
                        invitePagination.on('switch', function (e) {
                            IO.post(SP.resolvedIOPath('expert/listExpert?_content=json'),
                                {
                                    pageNo: e.toPage
                                },
                                function (d) {
                                    d = JSONX.decode(d)
                                    EXPERT_INVITE.experts = d.data.pageItems
                                    $('.pageSwitchHidden')[0].click()
                                    invitePagination.set('totalPage', d.data.maxPageNum)
                                    invitePagination.renderUI()
                                }, "json")
                        })
                        var invitePagination2 = new PG($('#expertInvitePaginationContainer2'), {
                            currentPage: 1, // 默认选中第?页
                            totalPage: invitedExperts.maxPageNum, // 一共有?页
                            firstPagesCount: 0, // 显示最前面的?页
                            preposePagesCount: 0, // 当前页的紧邻前置页为?页
                            postposePagesCount: 0, // 当前页的紧邻后置页为?页
                            lastPagesCount: 0, // 显示最后面的?页
                            render: true
                        })
                        invitePagination2.on('switch', function (e) {
                            IO.post(SP.resolvedIOPath('expert/listInvitedExpert?_content=json'),
                                {
                                    pageNo: e.toPage
                                },
                                function (d) {
                                    d = JSONX.decode(d)
                                    EXPERT_INVITE.invitedExperts = d.data.pageItems
                                    $('.pageInvitedSwitchHidden')[0].click()
                                    invitePagination2.set('totalPage', d.data.maxPageNum)
                                    invitePagination2.renderUI()
                                }, "json")
                        })
                        var auth = new Auth('#J_Auth')
                        auth.plug(new AuthMsgs())
                        auth.render()
                    }, "json")
            }, "json")
    },
    hide: function (p) {
        if ($('#expertInviteWrap')) {
            $('#expertInviteWrap').remove()
        }
    }
}