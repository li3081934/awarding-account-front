var $ = require('node').all;
var tpl = require('./header-view');
var ccTpl = require('./controlCenter-view');
var cpTpl = require('./changePortrait-view');
var XTemplate = require("kg/xtemplate/3.3.3/runtime");
var Auth = require('kg/auth/2.0.6/');
var AuthMsgs = require('kg/auth/2.0.6/plugin/msgs/');
var AD = require('kg/agiledialog/5.0.2/index')
var UA = require('ua');
var IO = require('io');
var SP = require('core-front/smartPath/smartPath');
var AI = require('core-front/authIdentify/index');
var OVL = require('overlay');
var UrlsInput = require('kg/uploader/2.0.3/plugins/urlsInput/urlsInput');
var ProBars = require('kg/uploader/2.0.3/plugins/proBars/proBars');
var Filedrop = require('kg/uploader/2.0.3/plugins/filedrop/filedrop');
var ImgCrop = require('kg/uploader/2.0.3/plugins/imgcrop/imgcrop');
var UploaderAuth = require('kg/uploader/2.0.3/plugins/auth/auth');
var AliUploader = require('gallery/uploader/kissyuploader/5.0.0/index');
var JSONX = require('core-front/jsonx/jsonx');
var personConfig = require('./personConfig/personConfig');
var searchBar = require('./searchBar/searchBar');
module.exports = {
    init: function (focusId) {
        var ohtml = new XTemplate(tpl).render({});
        $('header').html(ohtml);
        var ai = new AI(token);
        var portraitUrl = function (account) {
            if (account.accountBucket[0].originalPortrait == null) {
                return SP.resolvedPath('./account/images/home/home_u28.png');
            } else {
                return account.accountBucket[0].px40Portrait;
            }
        };
        if (ai.existChecked()) {
            ai.acquireAccount(SP.resolvedIOPath('getAccountWithBucket?_content=json'), function (account) {
                var html = new XTemplate(tpl).render({
                account: account,
                    portraitUrl: portraitUrl(account)
            });
                var ccHtml = new XTemplate(ccTpl).render({});
                var cpHtml = new XTemplate(cpTpl).render({
                    account: account
                });
                $('header').html(html);
                var ol = new OVL({              //弹出层组件
                    content: ccHtml,
                    visible: true,
                    xy: [$('#headerContainer').offset().left + 930, 50],
                    width: '90px',
                    height: '135px',
                    zIndex: 10,
                    visible: false,
                    prefixCls: 'fixed-',
                    closeAction: 'hide'
                });
                ol.render();
                $(window).on('resize', function () {
                    ol.set('xy', [$('#headerContainer').offset().left + 930, 50])
                })
                $('#home_u28').on('mouseover', function () {
                    ol.show();
                }).on('mouseout', function () {
                    ol.close();
                });
                $('#home_u30').on('mouseover', function () {
                    ol.show();
                }).on('mouseout', function () {
                    ol.close();
                });
                $('#home_u32').on('mouseover', function () {
                    ol.show();
                }).on('mouseout', function () {
                    ol.close();
                });
                $('#home_u33').on('click', function () {
                    pop(ol2);
                })
                $('#home_u39').on('click', function () {
                    pop(personConfig.ol());
                })
                var ol2 = new OVL({
                    effect: 'slide',    // {String} - 可选, 默认为'none', 'none'(无特效), 'fade'(渐隐显示), 'slide'(滑动显示).
                    easing: 'linear',        // {String} - 可选, 同 KISSY.Anim 的 easing 参数配置.
                    duration: 10,        // {Number} - 可选, 动画持续时间, 以秒为单位.
                    target: '',
                    content: cpHtml,
                    visible: true,
                    xy: [450, 150],
                    width: '400px',
                    height: '390px',
                    closable: true,
                    zIndex: 5,
                    prefixCls: 'ks-fixed-',
                    visible: false,
                    closeAction: 'hide'
                });
                ol2.render();

                KISSY.use('kg/uploader/2.0.3/themes/cropUploader/index,kg/uploader/2.0.3/themes/imageUploader/style.css,kg/uploader/2.0.3/themes/cropUploader/style.css', function (S, ImageUploader) {
                    var uploader = new AliUploader('#J_UploaderBtn', {
                        action: SP.resolvedIOPath('account/uploadPortrait?_content=json'),
                        multiple: false,
                        type: 'ajax',
                        name: 'Filedata'
                    });
                    uploader.set('filter', function (data) {
                        data.success = 1;
                        return data;
                    })
                    uploader.theme(new ImageUploader({queueTarget: '#J_UploaderQueue'}));
                    var imgCrop = new ImgCrop({
                        initialXY: [10, 10], //初始坐标
                        initWidth: 200, //初始宽度
                        initHeight: 200, //初始高度
                        minHeight: 100, //最小高度
                        minWidth: 100, //最小宽度
                        touchable: true, //支持touch、pinch
                        ratio: true, //固定比例缩放
                        resizable: true//可以缩放
                    });
                    uploader.plug(new UploaderAuth({
                        maxSize: 1024,
                        required: true,
                        allowExts: 'jpg,png,gif,bmp,jpeg'
                    })).plug(new UrlsInput({target: '#J_Urls'}))
                        .plug(new ProBars())
                        .plug(new Filedrop())
                        .plug(imgCrop);
                    uploader.on('select', function (e) {
                        if (UA.ie < 10) {
                            new AD({
                                type: 'alert',
                                content: '很抱歉，IE9及更低版本浏览器目前还无法上传'
                            })
                        }
                    })
                    uploader.on('error', function (ev) {
                        new AD({
                            type: 'alert',
                            content: ev.msg
                        });
                    });
                    uploader.on('success', function (ev) {
                    });
                    var computeModifyH = function () {
                        var crop = imgCrop.get('crop');
                        return parseInt(crop.getCropCoords().h * crop.getOriginalSize().height / crop.getDisplaySize().height);
                    };
                    var computeModifyW = function () {
                        var crop = imgCrop.get('crop');
                        return parseInt(crop.getCropCoords().w * crop.getOriginalSize().width / crop.getDisplaySize().width);
                    };
                    var computeModifyX = function () {
                        var crop = imgCrop.get('crop');
                        return parseInt(crop.getCropCoords().x * crop.getOriginalSize().width / crop.getDisplaySize().width);
                    };
                    var computeModifyY = function () {
                        var crop = imgCrop.get('crop');
                        return parseInt(crop.getCropCoords().y * crop.getOriginalSize().height / crop.getDisplaySize().height);
                    };
                    $('.submitPortrait').on('click', function () {
                        if (imgCrop.get('crop').get('url') != '') {
                            IO.post(SP.resolvedIOPath('account/savePortraitModify?_content=json'),
                                {
                                    id: account.accountBucket[0].id,
                                    portraitModify: account.accountBucket[0].portraitModify,
                                    portraitModifyH: computeModifyH(),
                                    portraitModifyW: computeModifyW(),
                                    portraitModifyX: computeModifyX(),
                                    portraitModifyY: computeModifyY()
                                },
                                function (d) {
                                    d = JSONX.decode(d);
                                    $('#home_u28_img').prop('src', portraitUrl(d.account));
                                    ol2.close();
                                }, "json");
                        } else {
                            new AD({
                                type: 'alert',
                                content: "您还没有上传新头像"
                            });
                        }
                    })
                    $('#J_DefaultBtn').on('click', function () {
                        new AD({
                            title: '温馨提示',
                            content: '您确定要恢复为默认头像？',
                            onConfirm: function () {
                                uploader.get('queue').clear();
                                IO.post(SP.resolvedIOPath('account/deletePortrait?_content=json'),
                                    {
                                        id: account.accountBucket[0].id
                                    },
                                    function (d) {
                                        d = JSONX.decode(d);
                                        $('#home_u28_img').prop('src', portraitUrl(d.account));
                                        ol2.close();
                                    }, "json");
                            },
                            onCancel: function () {
                            },
                            onClose: function () {
                            }
                        })
                    })
                })
                $('#home_u37').on('click', function () {
                    new AD({
                        title: '温馨提示',
                        content: '您确定要退出评奖系统？',
                        onConfirm: function () {
                            IO.post(SP.resolvedIOPath('account/signOut?_content=json'), {}, function (data) {
                                if (data) {
                                    window.location.assign(SP.resolvedPath('.'));
                                }
                            }, 'json');
                        },
                        onCancel: function () {
                        }
                    });
                })
                var pop = function (_ol) {
                    var overlays = [ol2, personConfig.ol()];
                    for (var i = 0; i < overlays.length; i++) {
                        overlays[i].close();
                    }
                    _ol.show();
                }
                /*处理顶层菜单逻辑*/
                $('.menu').on('click', function (e) {
                    if ($(e.currentTarget).hasClass('menu-unfocus')) {
                        $('.menu').replaceClass('menu-focus', 'menu-unfocus')
                        $(e.currentTarget).replaceClass('menu-unfocus', 'menu-focus')
                    }
                })

                $('#home_u12').on('click',function(){
                    window.location.assign(SP.resolvedPath('project'))
                })
                $('#home_u18').on('click', function () {
                    window.location.assign(SP.resolvedPath('expertNew'))
                })
                $('#home_u22').on('click', function () {
                    window.location.assign(SP.resolvedPath('group'))
                })
                $('#home_u42').on('click', function () {
                    window.location.assign(SP.resolvedPath('review'))
                })
                if (focusId != null) {
                    $('#' + focusId).replaceClass('menu-unfocus', 'menu-focus')
                }
                personConfig.init({account: account});
                searchBar.init({})
                SP.resolveImgSrc('.img');
            });
        }
    }
}