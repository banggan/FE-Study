var $ = require('jQuery');
var Component = require('../../Component');
var template = require('../../../template/my-collect-window.html');
var dispatcher = require('.././../../global/dispatcher');
var ActionType = require('./../../../constant/ActionType');
var MsgViewer = require('../../msg/MsgViewer');
var ContentMenu = require('../contentMenu/ContentMenu');
var config = require('.././../../global/config');
const { isEmpty, isGroupUser } = require('../../../global/utils');
var _msgsHandle = function (msgs) {
  if (!msgs) {
    return
  }
  msgs.forEach(function (msg, msgindex) {
    if (typeof msg.content === 'string') {
      msg.content = JSON.parse(msg.content);
    }
    switch (msg.content.type) {
      case 'audio':
        msg.content.msg = '[语音]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'video':
        msg.content.msg = '[视频]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'text':
        break;
      case 'card':
      case 'minicard':
      case 'universal_card1':
      case 'universal_card2':
      case 'universal_card3':
      case 'mix':
      case 'universal_card4':
      case 'universal_card5':
      case 'universal_card6':
      case 'private_card_ganji':
        msg.content.msg = '[卡片]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'provide_contactinfo_card':
      case 'default_contactinfo_card':
        msg.content.msg = '[名片]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'standard_evaluate_card1':
      case 'standard_evaluate_card2':
        msg.content.msg = '[评价邀请]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'file':
        msg.content.msg = '[图片]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'location':
        msg.content.msg = '消息格式暂不支持，请在客户端查看';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'call_audio':
        msg.content.msg = '[收到一条语音聊天消息，请在手机上查看]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'call_video':
        msg.content.msg = '[收到一条视频聊天消息，请在手机上查看]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'image':
        msg.content.msg = '[图片]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      case 'msg_batch_forward_card':
        msg.content.msg = '[聊天记录]';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
      default:
        msg.content.msg = '消息格式暂不支持，请在客户端查看';
        msg.content.type = 'text';
        msg.show_type = 'text';
        break;
    }
  });
  return msgs;
}
var _compare = function (a, b) {
  if (a.send_time > b.send_time)
    return -1;
  else if (a.send_time < b.send_time)
    return 1;
  else
    return 0;
};
var _handleCollectMsgs = function (collectlists) {
  var _messages = [];
  if (!collectlists) return
  collectlists.forEach(function (collect, index) {
    if (collect.msgs && collect.msgs.length >= 2) {//多条收藏
      var msgs = $.extend(true, [], collect.msgs.slice(0, 2));
      msgs = _msgsHandle(msgs)
      let _content = [];
      msgs.forEach(msg => {
        _content.push({
          msg_content: msg.content.msg,
          name: msg.sender_name,
          msg: msg
        })
      });
      collect.msgs.forEach(collectMsg => {
        collectMsg.msg_showtype = 'collect';
        collectMsg.msg_collect = "collect";
      });
      var userName = !isEmpty(collect.other_name) ? collect.other_name : _content[0].name;
      if (isGroupUser({ user_source: msgs[0].to_source }) && isEmpty(collect.other_name)) {
        userName = '群';
      }
      _messages.push({
        collect_id: collect.collect_id,
        msg_id: collect.collect_id,
        forward_msgs: collect.forward_msgs,
        msgs: collect.msgs,
        content: _content,
        sender_info: {
          user_name: userName
        },
        title: userName + '的聊天记录',
        send_time: collect.collect_time,
        show_type: 'chat_card',
        msg_showtype: 'collect'
      });
    } else {//单条收藏
      var msg = collect.msgs[0];
      if (typeof msg.content === 'string') {
        msg.content = JSON.parse(msg.content);
      }
      // 语音消息链接转换
      if (collect.type === 'audio') {
        var oldUrl = msg.content.url;
        msg.content.url = config['audio-converter'](oldUrl);
      }
      _messages.push({
        collect_id: collect.collect_id, //同样的id 只展示一条
        msg_id: collect.collect_id,
        forward_msgs: collect.forward_msgs,
        msgs: collect.msgs,
        content: msg.content,
        sender_info: {
          user_name: msg.sender_name
        },
        to_source: msg.to_source,//服务端没有返回，先写108
        send_time: collect.collect_time,
        show_type: collect.type === 'link' ? msg.content.type : collect.type,
        msg_showtype: 'collect'
      });
    }

  });
  _messages.sort(_compare); //排序
  return _messages;
};

var MyCollectWindow = function (options) {
  (function (self) {
    var defaults = {
      template: template
    };
    $.extend(defaults, options);
    Component.call(self, defaults);
    self._menuTexts = [];
    self._messages = [];
    self._type = '';
    self._isLoading = false;
    self._haveMore = true;
    self.iconIndex = '0';
    var menuText = ['全部', '聊天记录', '图片', '文件', '链接', '音频', '视频'];
    self.updateMenuList(menuText);
    self.updateMenuActive();
  })(this);

  (function (self) {
    self._children['contentmenu'] = new ContentMenu({});
    self._element.find('.im-menu-container').append(self._children['contentmenu'].getElement());
    self._children['contentmenu'].addEventListener('click', function (item) {
      switch (item.action) {
        case 'delCollection':
          dispatcher.dispatch({
            type: ActionType.DEL_COLLECTION,
            data: {
              message: item.message
            }
          })
          self._element.find('.im-menu-container').hide();
          self._children['contentmenu'].hide();
          break;
        default:
          break;
      }
    });
  })(this);

  (function (self) {
    self._element.click(function (e) {
      e.stopPropagation();
      var _target = $(e.target);
      //关闭
      if (_target.hasClass('window-collect-header-close')) {
        self.iconIndex = '0';
        self.updateMenuActive();
        self.hide();
        dispatcher.dispatch({
          type: ActionType.CLOSE_ALL_FLOAT_VIEWS
        });
        return;
      }
      //选择收藏类型
      if (_target.hasClass('menu-icon') || _target.hasClass('window-collect-menu-text')) {
        var iconIndex = _target[0].dataset.icon;
        var type = iconIndex === '1' ? 'chat' : iconIndex === '2' ? 'image' :
          iconIndex === '3' ? 'file' : iconIndex === '4' ? 'link' :
            iconIndex === '5' ? 'audio' : iconIndex === '6' ? 'video' : '';
        //调接口、更新右边的收藏消息
        self.iconIndex = iconIndex;
        self.updateMenuActive()
        self._type = type;
        if (type !== undefined) {
          dispatcher.dispatch({
            type: ActionType.GET_MY_COLLECTION,
            data: {
              type: type
            }
          })
        }

      }

    });
  })(this);
};
MyCollectWindow.prototype = Object.create(Component.prototype);
MyCollectWindow.prototype.render = function () {
  var $element = this.getElement();
  var $collect_content = $element;
  var $collect_title = $collect_content.find('.window-collect-header-title')
  var $collect_close = $collect_content.find('.window-collect-header-close')
  //标题
  $collect_title.text('我的收藏')
  //收藏的消息
  this.updateCollectMsgs(this._data.collections, this._data.have_more)
  //空间
  var total = this._data.total / 1024 / 1024 + ' MB';
  var remained_size = Math.ceil((this._data.total - this._data.remained_size) / 1024 / 1024) + ' MB';
  $collect_content.find('.window-collect-menu-space').text('已用空间:' + remained_size + '/' + total);
};

MyCollectWindow.prototype.updateCollectMsgs = function (collectlists, have_more) {
  var self = this;
  var messages = _handleCollectMsgs(collectlists)
  self._messages = messages;
  self._haveMore = have_more;
  self._element.find('.window-collect-msgs').empty()
  var msgViewer = new MsgViewer({});
  self._children['msgViewer'] = msgViewer;
  self._element.find('.window-collect-msgs').append(msgViewer.getElement());
  //添加消息
  self._children['msgViewer'].addCollectMsg(messages);
  self._children['msgViewer'].addEventListener('addMoreCollectMsg', function () {
    if (self._haveMore && !self._isLoading) {
      self.isLoading = true;
      self._children['msgViewer'].startLoading();
      self.getMoreCollectMsg(function (collectlists, have_more) {
        var addCollectlists = _handleCollectMsgs(collectlists)
        self._messages = addCollectlists;
        self._isLoading = false;
        self._haveMore = have_more;
        self._children['msgViewer'].stopLoading();
        self._children['msgViewer'].addCollectMsg(addCollectlists, have_more);
      });
    }

  });
  self._children['msgViewer'].addEventListener('contentMenuOpen', function (options) {
    self._element.find('.im-menu-container').show();
    var selections = [
      {
        text: '删除',
        action: 'delCollection'
      }
    ];
    self._children['contentmenu'].setData({
      selections: selections,
      message: options.message
    });
    if (selections.length) self._element.find('.im-menu-container').css('left', options.position.x - self._element.offset().left).css('top', options.position.y - self._element.offset().top).show();
    self._children['contentmenu'].show();
    self._children['msgViewer']._options.contentOpened = true;
  });
  self._children['msgViewer'].addEventListener('contentMenuClose', function (options) {
    self._element.find('.im-menu-container').hide();
    self._children['contentmenu'].hide();
    self._children['msgViewer']._options.contentOpened = false;
    //self._element.find('.im-multiplemenu-container').hide();
  });
};
MyCollectWindow.prototype.delCollections = function (collectids) {
  var self = this;
  collectids.forEach(function (item, index) {
    self._children['msgViewer'].remove(null, null, item);
  })
}
MyCollectWindow.prototype.updateMenuList = function (texts) {
  var self = this;
  if (self._menuTexts && texts && JSON.stringify(self._menuTexts) == JSON.stringify(texts)) {
    return;
  }
  self._element.find('.window-collect-menu-texts').html('');
  $(texts).each(function (index, item) {
    self._element.find('.window-collect-menu-texts').append($('<li class="menu-icon menu-icon-' + index + '" data-icon ="' + index + '" ><span class="menu-icon menu-icon-' + index + '" data-icon ="' + index + '" ></span><span class="window-collect-menu-text" data-icon ="' + index + '">' + item + '</span></li>'));
  });
  self._menuTexts = texts;
};
MyCollectWindow.prototype.updateMenuActive = function () {
  var self = this;
  let $menuLis = self._element.find('.window-collect-menu-texts').children()
  let len = $menuLis.length;
  for (let i = 0; i < len; i++) {
    $($menuLis[i]).removeClass('active');
    if (self.iconIndex && self.iconIndex == i) {
      $($menuLis[i]).addClass('active')
    }
  }
};
MyCollectWindow.prototype.getMoreCollectMsg = function (callback) {
  if (this._messages.length && typeof callback === 'function' && typeof this._options.getMoreCollectMsg === 'function') {
    var last_message = this._messages[this._messages.length - 1];
    var params = {
      last_collect_id: last_message.msg_id,
      type: this._type,
      count: 50
    }
    this._options.getMoreCollectMsg(params, callback);
  }
};

MyCollectWindow.prototype.show = function (text) {
  Component.prototype.show.call(this);
  var $element = this.getElement();
  var $collect_content = $element;
  var $collect_bg = $element.find(".window-collect-bg");
  $collect_content.show();
  $collect_bg.show();
};
MyCollectWindow.prototype.hide = function () {
  Component.prototype.hide.call(this);
  var $element = this.getElement();
  var $collect_content = $element;
  var $collect_bg = $element.find(".window-collect-bg");
  $collect_content.hide();
  $collect_bg.hide();
};

module.exports = MyCollectWindow;
