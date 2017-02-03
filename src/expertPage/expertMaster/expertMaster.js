var $ = require('node').all
var XTemplate = require("kg/xtemplate/3.3.3/runtime")
var manageView = require('./expertMaster-view')
var Bidi = require('gallery/bidi/1.3/');

var Auth = require('kg/auth/2.0.6/')
var AuthMsgs = require('kg/auth/2.0.6/plugin/msgs/')
require('kg/auth/2.0.6/plugin/msgs/style.css')
require('./expertMaster.css')

module.exports = {
    init: function (p) {
        var EXPERT_INVITE={
            data:[
                {expertName:'范济安',expertPart:'北京分公司',isConfirm:"0",group:'网络组',expertID:'1',expertEmail:'faf@qq.com'},
                {expertName:'陈淑平',expertPart:'天津分公司',isConfirm:"1",group:'IT支撑组',expertID:'2',expertEmail:'dfg@qq.com'},
                {expertName:'哈特我',expertPart:'北京分公司',isConfirm:"0",group:'业务终端组',expertID:'3',expertEmail:'asd@qq.com'},
                {expertName:'东方红',expertPart:'北京分公司',isConfirm:"0",group:'业务终端组',expertID:'5',expertEmail:'asd@qq.com'},
                {expertName:'htr',expertPart:'北京分公司',isConfirm:"0",group:'0',expertID:'4',expertEmail:'sdf@qq.com'}
            ],
            groups:[
                {name:'网络组'},
                {name:'业务终端组'},
                {name:'IT支撑组'}
            ],
            projectData:[
                {pOName:'安徽联通巢湖本地网网络拆分技术及应用werwerwerwer',pName:'001-网络-安徽-巢湖本地网网络拆分技术及应用',part:'安徽分公司',comment:'cBSS是第一个全部实现计费应用去IOE的全国集中系统，行业内实现2亿以上用户全国集中的支撑能力，具有国际领先的能力。 创新研发分布式排重子系统（Bloom Filter算法+Redis+Hbase），排重效率是传统文件排重的10倍。 采用廉价磁盘的分布式文件系统，有效缓解生产存储空间不足的问题，大幅降低存储设备投资；采用分布式内存库，消除单省用户数限制。 引进Storm流计算框架、SaltStack等技术自主研发了BRM平台，实现分布式环境下的实时日志采集分析功能，解决了分布式环境下问题定位难、运维难的',master:'哈特我',pID:'1',group:'网络组'},
                {pOName:'基于SIM卡的免口令一点安全认证系统及规模应用',pName:'001-业务-北京-基于SIM卡的免口令一点安全认证系统及规模应用',part:'北京分公司',comment:'',master:'0',pID:'2',group:'业务终端组'},
                {pOName:'中国联通终端连锁化服务平台项目',pName:'002-业务-产创-中国联通终端连锁化服务平台项目',part:'产品创新部',comment:'cBSS是第一个全部实现计费应用去IOE的全国集中系统，行业内实现2亿以上用户全国集中的支撑能力，具有国际领先的能力。',master:'0',pID:'3',group:'IT支撑组'}
            ],
            openWindow:"1",
            openPWindow:"1",
            openCWindow:'1',
            isEdit : '0',
            handle:{
                SelectGroup:function(e,data) {
                    var gName = e.target.value
                    //拿到select的值发请求更新data列表数据  执行this.set更新
                    this.set('data',
                        [{expertName:'ghh',expertPart:'北京分公司',isConfirm:"0",group:'0',expertID:'4'}],
                        this.get(''))

                },
                eInfoEdit:function(e,data){
                    var tName=e.target.name
                    if(e.target.innerText=='修改'){
                        $("input[name='"+tName+"']").removeAttr('readonly')
                        e.target.innerText='确定'
                    }else{
                        $("input[name='"+tName+"']").attr('readonly','readonly')
                        e.target.innerText='修改'
                        var eData=this.get('data'),eID=$("#J_Auth").attr('name')
                        //回掉里执行for循环
                        for(var i = 0; i<eData.length;i++){
                            if(eID==eData[i].expertID){
                                this.set(tName,$("input[name='"+tName+"']").val(),eData[i])
                            }
                        }

                    }
                },
                infoEditShow:function(e,data){
                    this.set('openWindow', '0')
                    $("input[name='expertName']").val(data.expertName)
                    $("input[name='expertEmail']").val(data.expertEmail)
                    $("input[name='expertPart']").val(data.expertPart)
                    $("#J_Auth").attr('name',data.expertID)
                },
                pInfoShow:function(e,data){

                    this.set('openPWindow', '0')
                    var id = e.target.name
                    var pData = this.get('projectData')
                    for(var i =0;i<pData.length;i++){
                        if(pData[i].pID==id){
                            $("input[name='pName']").val(pData[i].pName)
                            $("input[name='pOName']").val(pData[i].pOName)
                            $("input[name='part']").val(pData[i].part)

                        }
                    }
                    //$("#J_Auth").attr('name',data.expertID)
                },
                commentShow:function(e){
                    this.set('openCWindow', '0')
                    var id = e.target.name
                    var pData = this.get('projectData')
                    for(var i =0;i<pData.length;i++){
                        if(pData[i].pID==id){
                            $("input[name='pName']").val(pData[i].pName)
                            $("textarea[name='comment']").val(pData[i].comment)
                            $("#commentEdit").attr('name',pData[i].pID)
                        }
                    }
                },
                commentEdit:function(e){
                    var tName=e.target.name
                    if(e.target.innerText=='修改'){
                        $("textarea[name='"+tName+"']").removeAttr('readonly')
                        e.target.innerText='确定'
                    }else{
                        $("textarea[name='"+tName+"']").attr('readonly','readonly')
                        e.target.innerText='修改'
                        var eData=this.get('projectData'),eID=$("#commentEdit").attr('name')
                        //回掉里执行for循环
                        for(var i = 0; i<eData.length;i++){
                            if(eID==eData[i].pID){
                               // this.set(tName,$("textarea[name='"+tName+"']").val(),eData[i])
                                eData[i][tName]=$("textarea[name='"+tName+"']").val()
                            }
                        }

                    }
                },
                overlayHide:function(data){
                    $("input[name='expertName']").val('')
                    $("input[name='expertEmail']").val('')
                    $("input[name='expertPart']").val('')
                    $("#J_Auth").removeAttr('name')
                    this.set('openWindow', '1')
                    this.set('openPWindow', '1')
                    this.set('openCWindow', '1')

                }



            }
        }



        var manage = new XTemplate(manageView).render()
        p.node.html(manage)
        Bidi.active(['action', 'class', 'attr', 'text', 'click', 'value','change'])

        Bidi.xbind('expertManageList',EXPERT_INVITE,EXPERT_INVITE.handle,manage)
        Bidi.init()
        var auth = new Auth('#J_Auth');
        auth.plug(new AuthMsgs());
        ////////////select绑定事件

        $('.choseMaster').on('change',function(){
            //发ajax请求
            var pID=this.name,master=this.value
            //回掉执行下面
            if($(this).children("option[value='0']").length>0){
                $(this).children("option[value='0']").remove()
                $(this).parent('li.expertItem').addClass('isMaster')
            }
            //$(this).children("option[value='0']")
        })
    },
    hide : function (p) {
        if ($('#expertMasterWrap')) {
            $('#expertMasterWrap').remove()
        }
    }

}