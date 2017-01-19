'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var uid = require('../utils/uid');

var Block = (function () {
  function Block(params) {
    _classCallCheck(this, Block);

    this.id = uid();
    this.content = params.content || {};
    this.parent = params.parent;
    this.type = params.type;
    this.clientOnly = params.clientOnly || false;
  }

  _createClass(Block, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.id;
    }
  }]);

  return Block;
})();

module.exports = Block;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvQmxvY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBOztJQUUzQixLQUFLO0FBRUUsV0FGUCxLQUFLLENBRUcsTUFBTSxFQUFFOzBCQUZoQixLQUFLOztBQUdQLFFBQUksQ0FBQyxFQUFFLEdBQVcsR0FBRyxFQUFFLENBQUE7QUFDdkIsUUFBSSxDQUFDLE9BQU8sR0FBTSxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQTtBQUN0QyxRQUFJLENBQUMsTUFBTSxHQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUE7QUFDL0IsUUFBSSxDQUFDLElBQUksR0FBUyxNQUFNLENBQUMsSUFBSSxDQUFBO0FBQzdCLFFBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxLQUFLLENBQUE7R0FDN0M7O2VBUkcsS0FBSzs7V0FVRixtQkFBRztBQUNSLGFBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQTtLQUNmOzs7U0FaRyxLQUFLOzs7QUFnQlgsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUEiLCJmaWxlIjoiQmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgdWlkID0gcmVxdWlyZSgnLi4vdXRpbHMvdWlkJylcblxuY2xhc3MgQmxvY2sge1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgIHRoaXMuaWQgICAgICAgICA9IHVpZCgpXG4gICAgdGhpcy5jb250ZW50ICAgID0gcGFyYW1zLmNvbnRlbnQgfHwge31cbiAgICB0aGlzLnBhcmVudCAgICAgPSBwYXJhbXMucGFyZW50XG4gICAgdGhpcy50eXBlICAgICAgID0gcGFyYW1zLnR5cGVcbiAgICB0aGlzLmNsaWVudE9ubHkgPSBwYXJhbXMuY2xpZW50T25seSB8fCBmYWxzZVxuICB9XG5cbiAgdmFsdWVPZigpIHtcbiAgICByZXR1cm4gdGhpcy5pZFxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbG9ja1xuIl19