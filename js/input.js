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
      this.eventType = eventType || 'change';
      this.rule = this.parseRule();
      this.validator = new Validator(this.node.value, this.rule);
    },
    addEvent: function() {
      var eventHandler = function(e) {
        var result = this.validator.isValid(this.node.value);
        this.changeInfo('');
        if (!result.ok) {
          this.changeInfo(result.msg);
        }
      }.bind(this);
      this.node.addEventListener(this.eventType, eventHandler);
    },
    parseRule: function() {
      var tmpRule = {};
      var ruleStr = this.node.getAttribute('data-limit');
      if (!ruleStr) {
        return;
      }
      ruleStr.split('|').forEach(function(item) {
        item = item.split(':');
        tmpRule[item[0]] = JSON.parse(item[1]);
      });
      return tmpRule;
    },
    changeInfo: function(warn) {
      if (this.tipNode || warn === '') {
        this.tipNode.innerHTML = warn;
      } else {
        alert(warn);
      }
    }
  }
  window.Input = Input;

  // new input(document.querySelector('input[data-limit]'), document.querySelector('.tip'));
})();