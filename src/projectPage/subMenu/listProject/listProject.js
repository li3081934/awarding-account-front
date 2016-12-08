var $ = require('node').all
var XTemplate = require("kg/xtemplate/3.3.3/runtime")
var Node = require('node')
var OVL = require('overlay')
var IO = require('io')
var SP = require('core-front/smartPath/smartPath')
var JSONX = require('core-front/jsonx/jsonx')
var PG = require('kg/pagination/2.0.0/index')
var lpTpl = require('./listProject-view')
module.exports = {
    init: function (p) {
        var projectPagination = null
        var renderPage = function (p) {
            projectPagination = new PG($('#projectPaginationContainer'), {
                currentPage: p.pageNo, // Ĭ��ѡ�е�?ҳ
                totalPage: p.maxPageNum, // һ����?ҳ
                firstPagesCount: 0, // ��ʾ��ǰ���?ҳ
                preposePagesCount: 0, // ��ǰҳ�Ľ���ǰ��ҳΪ?ҳ
                postposePagesCount: 0, // ��ǰҳ�Ľ��ں���ҳΪ?ҳ
                lastPagesCount: 0, // ��ʾ������?ҳ
                render: true
            });
        }
        IO.post(SP.resolvedIOPath('project/listProject?_content=json'),
            {
                phase: 'editing'
            },
            function (d) {
                d = JSONX.decode(d)
                var lpHtml = new XTemplate(lpTpl).render({data: d.data})
                var ol = new OVL({
                    effect: 'slide',
                    easing: 'linear',
                    duration: 10,
                    target: '',
                    content: lpHtml,
                    visible: true,
                    xy: [880, 135],
                    width: '0px',
                    height: '0px',
                    closable: false,
                    zIndex: -1,
                    visible: true,
                    prefixCls: 'fixed-',
                    closeAction: 'hide'
                })
                ol.render()
                renderPage(d.data)
            }, "json")
    }
}