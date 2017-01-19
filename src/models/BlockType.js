'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var React = require('react');
var DefaultBlockType = require('../components/DefaultBlockType');

var defaults = {
  component: DefaultBlockType,
  group: null,
  maxChildren: Infinity,
  root: true,
  types: []
};

var BlockType = (function () {
  function BlockType(config) {
    _classCallCheck(this, BlockType);

    var _extends2 = _extends(this, defaults, config);

    var component = _extends2.component;

    if (typeof component === 'object') {
      this.component = React.createClass(component);
    }
  }

  _createClass(BlockType, [{
    key: 'valueOf',
    value: function valueOf() {
      return this.id;
    }
  }]);

  return BlockType;
})();

module.exports = BlockType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvQmxvY2tUeXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLElBQUksZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7O0FBRWhFLElBQUksUUFBUSxHQUFHO0FBQ2IsV0FBUyxFQUFLLGdCQUFnQjtBQUM5QixPQUFLLEVBQVMsSUFBSTtBQUNsQixhQUFXLEVBQUcsUUFBUTtBQUN0QixNQUFJLEVBQVUsSUFBSTtBQUNsQixPQUFLLEVBQVMsRUFBRTtDQUNqQixDQUFBOztJQUVLLFNBQVM7QUFFRixXQUZQLFNBQVMsQ0FFRCxNQUFNLEVBQUU7MEJBRmhCLFNBQVM7O29CQUdTLFNBQWMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUM7O1FBQW5ELFNBQVMsYUFBVCxTQUFTOztBQUVmLFFBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFO0FBQ2pDLFVBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtLQUM5QztHQUNGOztlQVJHLFNBQVM7O1dBVU4sbUJBQUc7QUFDUixhQUFPLElBQUksQ0FBQyxFQUFFLENBQUE7S0FDZjs7O1NBWkcsU0FBUzs7O0FBZ0JmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6IkJsb2NrVHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbmxldCBEZWZhdWx0QmxvY2tUeXBlID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9EZWZhdWx0QmxvY2tUeXBlJylcblxubGV0IGRlZmF1bHRzID0ge1xuICBjb21wb25lbnQgICA6IERlZmF1bHRCbG9ja1R5cGUsXG4gIGdyb3VwICAgICAgIDogbnVsbCxcbiAgbWF4Q2hpbGRyZW4gOiBJbmZpbml0eSxcbiAgcm9vdCAgICAgICAgOiB0cnVlLFxuICB0eXBlcyAgICAgICA6IFtdXG59XG5cbmNsYXNzIEJsb2NrVHlwZSB7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgbGV0IHsgY29tcG9uZW50IH0gPSBPYmplY3QuYXNzaWduKHRoaXMsIGRlZmF1bHRzLCBjb25maWcpXG5cbiAgICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3MoY29tcG9uZW50KVxuICAgIH1cbiAgfVxuXG4gIHZhbHVlT2YoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWRcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmxvY2tUeXBlXG4iXX0=