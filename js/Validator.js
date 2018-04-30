(function() {
  'use strict';
  /*
   * rule = {
   *    max: number,
   *    min: number,
   *    maxlength: number,
   *    minlength: number,
   *    required: true/false,
   *    numeric: true/false,
   *    pattern: true/false,
   *    same:selector
   * } 
   */
  function Validator(val, rule) {
    this.val = val;
    this.rule = rule;
  }
  Validator.prototype = {
    constructor: Validator,
    tpl: {
      bigger: "你要那么大干啥？",
      smaller: "嘿嘿嘿，你的怎么那么小~",
      longer: "太长啦~",
      shorter: "小...小...太小啦~",
      required: "这个一定要填呀~",
      numeric: "你填的怎么不是数字，差评哦",
      pattern: "敲黑板！要符合要求，听见没有~",
      same: '你是不是手残，两次密码输得都不一样！',
      default: ""
    },
    validateMax: function() {
      var result = {};
      var tmpVal = this.pre2Num();
      var preResult = this.validateNumeric();
      if (preResult.ok) {
        //如果是数字 
        if (tmpVal <= this.rule.max) {
          result = this.setResult(true, this.tpl.default);
        } else {
          result = this.setResult(false, this.tpl.bigger);
        }
      } else {
        //如果不是数字
        result = preResult;
      }
      return result;
    },
    validateMin: function() {
      var result = {};
      var tmpVal = this.pre2Num();
      var preResult = this.validateNumeric();
      if (preResult.ok) {
        //如果是数字 
        if (tmpVal >= this.rule.min) {
          result = this.setResult(true, this.tpl.default);
        } else {
          result = this.setResult(false, this.tpl.smaller);
        }
      } else {
        //如果不是数字
        result = preResult;
      }
      return result;
    },
    validateMaxlength: function() {
      var result = {};
      var tmpVal = this.pre2Str();
      if (tmpVal.length <= this.rule.maxlength) {
        result = this.setResult(true, this.tpl.default);
      } else {
        result = this.setResult(false, this.tpl.longer);
      }
      return result;
    },
    validateMinlength: function() {
      var result = {};
      var tmpVal = this.pre2Str();
      if (tmpVal.length >= this.rule.minlength) {
        result = this.setResult(true, this.tpl.default);
      } else {
        result = this.setResult(false, this.tpl.shorter);
      }
      return result;
    },
    validateRequired: function() {
      var result = this.setResult(true, this.tpl.default);
      var tmpVal = this.pre2Str();
      //要求必须有内容 并且没有内容
      if (this.rule.required && (!tmpVal)) {
        result = this.setResult(false, this.tpl.required)
      }
      return result;
    },
    validateNumeric: function() {
      var result = this.setResult(true, this.tpl.default);
      var tmp = this.pre2Num();
      //必须为数字 并且转为数字后与原来相等
      if (this.rule.numeric && tmp != this.val) {
        result = this.setResult(false, this.tpl.numeric);
      }
      //返回结果
      return result;
    },
    validatePattern: function() {
      var result = this.setResult(true, this.tpl.default);
      var reg = new RegExp(this.rule.pattern);
      if (!reg.test(this.val)) {
        result = this.setResult(false, this.tpl.pattern);
      }
      return result;
    },
    isValid: function(val, tplVal) {
      //保存结果
      var result = this.setResult(true, this.tpl.default);
      //如果有参数 改变要判断的值
      this.changeValue(val);
      //判断逻辑
      for (var item in this.rule) {
        //拼接函数名  
        item = 'validate' + item.substr(0, 1).toUpperCase() + item.substr(1);
        //判断是否通过验证
        var tmp =this[item](tplVal);
        if (!tmp.ok) {
          //没通过 result设为false 
          result = tmp;
          // 跳出循环
          break;
        }
      }
      return result;
    },
    validateSame: function(tplVal) {
      var result = this.setResult('true', '');
      //如果没有传入值则跳过检测
      if (!tplVal) return result;

      //检测逻辑
      if (this.rule.same && tplVal != this.val) {
        result = this.setResult('false', this.tpl.same);
      }
      return result;
    },
    pre2Num: function() {
      return parseFloat(this.val);
    },
    pre2Str: function() {
      return this.val.toString().trim();
    },
    changeValue: function(val) {
      if (val !== undefined) {
        this.val = val;
      }
    },
    changeRule: function(rule) {
      if (rule !== undefined) {
        this.rule = rule;
      }
    },
    changeAll: function(val, rule) {
      this.changeValue(val);
      this.changeRule(rule);
    },
    setResult: function(ok, msg) {
      return { ok: JSON.parse(ok), msg: msg };
    }
  }
  window.Validator = Validator;

  /* Test */
  // var str = 'abcd';
  // var rule = {
    // max: 200,
    // min: 10,
    // maxlength: 10,
    // minlength: 3,
    // required: true,
    // numeric: true,
    // pattern: /^[0-9]{3}$/,
  //   same:'test'
  // };
  // var tpl = 'abcd'
  // var test = new Validator(str, rule);
  // console.log('小于最大值：', test.validateMax());
  // console.log('大于最小值：', test.validateMin());
  // console.log('小于最大长度：', test.validateMaxlength());
  // console.log('大于最小长度：', test.validateMinlength());
  // console.log('非空需求判断：', test.validateRequired());
  // console.log('数字需求判断：', test.validateNumeric());
  // console.log('正则判断：', test.validatePattern());
  // console.log('相同判断：', test.validateSame(tpl));
  // console.log('综合结果：', test.isValid(str,tpl));
  // /* Test End */
})();