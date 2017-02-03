var $ = require('node').all;
var XTemplate = require("kg/xtemplate/3.3.3/runtime");
var IO = require('io')
var Node = require('node');
var JSONX = require('core-front/jsonx/jsonx')
var PG = require('kg/pagination/2.0.0/index')
var SP = require('core-front/smartPath/smartPath')
var view = require('./detector-view');
var projectView = require('./detectorProject-view')
module.exports = {
    init: function (p) {
        var tpl = new XTemplate(view), projectTpl = new XTemplate(projectView), projectPagination = null
        var initListProjectButton = function () {
            $('.detector_u20').on('mouseover', function (e) {
                $(e.currentTarget).one('.detector_u21_txt').hide()
                $(e.currentTarget).all('.detector_button').show()
            })
                .on('mouseout', function (e) {
                $(e.currentTarget).one('.detector_u21_txt').show()
                $(e.currentTarget).all('.detector_button').hide()
            })
            $('.J_listProjectViewer').on('click', function (e) {
                var id = $(e.currentTarget).attr('data-id')
                window.open(SP.resolvedPath('viewProject/' + id))
            })
        }
        var renderProjectPagination = function (data, e) {
            projectPagination.set('currentPage', data.pageNo)
            projectPagination.set('totalPage', data.maxPageNum < e.toPage ? e.toPage : data.maxPageNum)
            projectPagination.renderUI()
            initListProjectButton()
        }
        var refresh = function () {
            IO.post(SP.resolvedIOPath('group/listProjectDetected?_content=json'),
                {
                    phase: 'submited'
                },
                function (d2) {
                    d2 = JSONX.decode(d2)
                    var projectHtml = projectTpl.render({
                        data: d2.data
                    })
                    var html = tpl.render({projectHtml: projectHtml})
                    p.node.html(html)
                    projectPagination = new PG($('#detectorProjectPaginationContainer'), {
                        currentPage: d2.data.pageNo, // Ĭ��ѡ�е�?ҳ
                        totalPage: d2.data.maxPageNum, // һ����?ҳ
                        firstPagesCount: 0, // ��ʾ��ǰ���?ҳ
                        preposePagesCount: 0, // ��ǰҳ�Ľ���ǰ��ҳΪ?ҳ
                        postposePagesCount: 0, // ��ǰҳ�Ľ��ں���ҳΪ?ҳ
                        lastPagesCount: 0, // ��ʾ������?ҳ
                        render: true
                    })
                    initListProjectButton()
                    projectPagination.on('switch', function (e) {
                        IO.post(SP.resolvedIOPath('group/listProjectDetected?_content=json'),
                            {
                                phase: 'submited'
                                , pageNo: e.toPage
                            },
                            function (_d2) {
                                _d2 = JSONX.decode(_d2)
                                var projectHtml = projectTpl.render({
                                    data: _d2.data
                                })
                                $('#listDetectotProjectContainer').html(projectHtml)
                                renderProjectPagination(_d2.data, e)
                            }, "json")
                    })
                }, "json")
        }
        refresh()
        this.refresh = function () {
            refresh()
        }
    }
}