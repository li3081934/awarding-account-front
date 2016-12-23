var $ = require('node').all
var XTemplate = require("kg/xtemplate/3.3.3/runtime")
var Node = require('node')
var SP = require('core-front/smartPath/smartPath')
var IO = require('io')
var JSONX = require('core-front/jsonx/jsonx')
var AD = require('kg/agiledialog/1.0.2/index')
var AI = require('core-front/authIdentify/index')
var STB = require('kg/stepbar/2.1.0/index')
var containerView = require('./container-view')
var stepBar = require('./stepBar/stepBar')
module.exports = {
    init: function () {
        var ai = new AI(token);
        if (ai.existChecked()) {
            IO.post(SP.resolvedIOPath('project/getProjectWithBucket?_content=json'), {
                id: projectId
            }, function (cb) {
                var containerTpl = new XTemplate(containerView)
                var containerHtml = containerTpl.render({})
                $('article').html(containerHtml)

                stepBar.init({
                    node: $('.stepBarContainer')
                    , phase: cb.data.phase
                })
            }, "json")
        }
    }
}