(function() {
  'use strict';

  function Input(node, tipNode, eventType) {
    this.init(node, tipNode, eventType);
    this.addEvent();
  }

  Input.prototype = {
    constructor: Input,
    init: function(node, tipNode, eventType) {
      this.node = node;
      this.tipNode = tipNode;
      this.tipNode.tip = document.createElement('div');
      this.tipNode.tip.className = 'u-warn';
      this.tipNode.append(this.tipNode.tip);
      this.eventType = eventType || 'change';
      this.rule = this.parseRule();
      this.validator = new Validator(this.node.value, this.rule);
    },
    addEvent: function() {
      this.node.addEventListener(this.eventType, this.check.bind(this));
    },
    parseRule: function() {
      var tmpRule = {};
      var ruleStr = this.node.getAttribute('data-limit');
      if (!ruleStr) {
        return [];
      }
      ruleStr.split('|').forEach(function(item) {
        item = item.split(':');
        tmpRule[item[0]] = JSON.parse(item[1]);
      });
      return tmpRule;
    },
    check: function(e) {
      var tplVal = this.rule.same ? document.querySelector(this.rule.same).value : '';
      var result = this.validator.isValid(this.node.value, tplVal);
      //把之前提示的内容清空
      this.changeInfo('');
      if (!result.ok) {
        //若检测有问题 显示提示内容
        this.changeInfo(result.msg);
      } else {
        this.node.style.color = 'green';
      }
      return result.ok;
    },
    changeInfo: function(warn) {
      warn = warn || '';
      //如果传入了tipNode
      if (this.tipNode) {
        this.tipNode.tip.innerHTML = warn;
      } else {
        //没传入tipNode
        alert(warn);
      }
    }
  }
  window.Input = Input;

  // new input(document.querySelector('input[data-limit]'), document.querySelector('.tip'));
})();