var $ = require('node').all
var XTemplate = require("kg/xtemplate/3.3.3/runtime")
var manageView = require('./expertManage-view')

var Bidi = require('gallery/bidi/1.3/');

var Auth = require('kg/auth/2.0.6/')
var AuthMsgs = require('kg/auth/2.0.6/plugin/msgs/')
require('kg/auth/2.0.6/plugin/msgs/style.css')
require('./expertManage.css')

module.exports = {
    init: function (p) {
        var EXPERT_INVITE={
            data:[
                {expertName:'范济安',expertPart:'北京分公司',isConfirm:"0",group:'网络组',expertID:'1'},
                {expertName:'陈淑平',expertPart:'天津分公司',isConfirm:"1",group:'IT支撑组',expertID:'2'},
                {expertName:'哈特我',expertPart:'北京分公司',isConfirm:"0",group:'0',expertID:'3'},
                {expertName:'htr',expertPart:'北京分公司',isConfirm:"0",group:'0',expertID:'4'}
            ],
            groups:[
                {name:'网络组'},
                {name:'业务终端组'},
                {name:'IT支撑组'}
            ],

            openWindow:"1",
            handle:{
                doGroup:function(e,data) {

                    this.set('group',data.group,data)
                    Bidi.init()
                   // this.fire('add:' + 'groups[0].expertData', {obj: {expertName:'范e济安',expertPart:'北京分公司',isConfirm:"0",group:'网络组',expertID:'1'}});
                   // var gName = e.target.value
                   // this.set('group', gName, data)
                   // var groups = this.get('groups')
                   // for(var i=0;i<groups.length;i++){
                   //     if(gName==groups[i].name){
                   //         console.log(groups[i].expertData)
                   //
                   //     }
                   // }
                    /*for(var i=0;i<groups.length;i++){

                        if(groups[i].name==gName){
                            groups[i].expertData.push(data)
                            Bidi.init()
                            $('.removeGroup').on('click',function(e){
                                var reName=e.target.name
                                debugger
                                for(var i = 0;i<EXPERT_INVITE.groups.length;i++){
                                    for(var k = 0;k<EXPERT_INVITE.groups[i].expertData.length;k++){
                                        if(EXPERT_INVITE.groups[i].expertData[k].expertName==reName){
                                            EXPERT_INVITE.groups[i].expertData.splice(k,1)
                                            Bidi.init()
                                        }
                                    }
                                }
                            })
                        }
                    }*/
                },
                removeGroup:function(data){
                    this.set('group','0',data)
                    Bidi.init()
                }


            }
        }



        var manage = new XTemplate(manageView).render()
        p.node.html(manage)
        Bidi.active(['action', 'class', 'attr', 'text', 'click', 'value','change'])

        //注册个助手方法
        Bidi.add('uio', {});
        Bidi.xbind('expertManageList',EXPERT_INVITE,EXPERT_INVITE.handle,manage)
        Bidi.init()
        var auth = new Auth('#J_Auth');
        auth.plug(new AuthMsgs());

/*        $('.removeGroup').on('click',function(e){
            var reName=e.target.name
            debugger
            for(var i = 0;i<EXPERT_INVITE.groups.length;i++){
                for(var k = 0;k<EXPERT_INVITE.groups[i].expertData.length;k++){
                    if(EXPERT_INVITE.groups[i].expertData[k].expertName==reName){
                        EXPERT_INVITE.groups[i].expertData.splice(k,1)
                        Bidi.init()
                    }
                }
            }
        })*/


    },
    hide : function (p) {
        if ($('#expertManageWrap')) {
            $('#expertManageWrap').remove()
        }
    }

}