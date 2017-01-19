'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Button = require('./Button');
var React = require('react');

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    block: React.PropTypes.object.isRequired,
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'col-menu-item',
      type: 'button',
      onClick: function onClick() {},
      isDisabled: function isDisabled() {}
    };
  },

  isDisabled: function isDisabled() {
    var _props = this.props;
    var app = _props.app;
    var block = _props.block;
    var isDisabled = _props.isDisabled;

    return isDisabled(app, block);
  },

  render: function render() {
    var _props2 = this.props;
    var label = _props2.label;
    var app = _props2.app;
    var block = _props2.block;
    var onOpen = _props2.onOpen;
    var onExit = _props2.onExit;
    var active = _props2.active;
    var isDisabled = _props2.isDisabled;
    var items = _props2.items;

    var safe = _objectWithoutProperties(_props2, ['label', 'app', 'block', 'onOpen', 'onExit', 'active', 'isDisabled', 'items']);

    return React.createElement(
      Button,
      _extends({}, safe, { onClick: this._onClick, disabled: this.isDisabled() }),
      label
    );
  },

  _onClick: function _onClick() {
    var _props3 = this.props;
    var app = _props3.app;
    var block = _props3.block;
    var onClick = _props3.onClick;

    onClick(app, block, this);
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01lbnVJdGVtLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDaEMsSUFBSSxLQUFLLEdBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUU3QixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVqQyxXQUFTLEVBQUU7QUFDVCxPQUFHLEVBQUssS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN6QyxTQUFLLEVBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN6QyxTQUFLLEVBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtBQUN6QyxNQUFFLEVBQU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVTtHQUMxQzs7QUFFRCxpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFdBQU87QUFDTCxlQUFTLEVBQUcsZUFBZTtBQUMzQixVQUFJLEVBQVEsUUFBUTtBQUNwQixhQUFPLEVBQUEsbUJBQUcsRUFBRTtBQUNaLGdCQUFVLEVBQUEsc0JBQUcsRUFBRTtLQUNoQixDQUFBO0dBQ0Y7O0FBRUQsWUFBVSxFQUFBLHNCQUFHO2lCQUNzQixJQUFJLENBQUMsS0FBSztRQUFyQyxHQUFHLFVBQUgsR0FBRztRQUFFLEtBQUssVUFBTCxLQUFLO1FBQUUsVUFBVSxVQUFWLFVBQVU7O0FBQzVCLFdBQU8sVUFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtHQUM5Qjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7a0JBQ3lFLElBQUksQ0FBQyxLQUFLO1FBQXBGLEtBQUssV0FBTCxLQUFLO1FBQUUsR0FBRyxXQUFILEdBQUc7UUFBRSxLQUFLLFdBQUwsS0FBSztRQUFFLE1BQU0sV0FBTixNQUFNO1FBQUUsTUFBTSxXQUFOLE1BQU07UUFBRSxNQUFNLFdBQU4sTUFBTTtRQUFFLFVBQVUsV0FBVixVQUFVO1FBQUUsS0FBSyxXQUFMLEtBQUs7O1FBQUssSUFBSTs7QUFFM0UsV0FDRTtBQUFDLFlBQU07bUJBQU0sSUFBSSxJQUFHLE9BQU8sRUFBRyxJQUFJLENBQUMsUUFBUSxBQUFFLEVBQUMsUUFBUSxFQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQUFBRTtNQUN4RSxLQUFLO0tBQ0EsQ0FDVjtHQUNGOztBQUVELFVBQVEsRUFBQSxvQkFBRztrQkFDcUIsSUFBSSxDQUFDLEtBQUs7UUFBbEMsR0FBRyxXQUFILEdBQUc7UUFBRSxLQUFLLFdBQUwsS0FBSztRQUFFLE9BQU8sV0FBUCxPQUFPOztBQUN6QixXQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUMxQjs7Q0FFRixDQUFDLENBQUEiLCJmaWxlIjoiTWVudUl0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgQnV0dG9uID0gcmVxdWlyZSgnLi9CdXR0b24nKVxubGV0IFJlYWN0ICA9IHJlcXVpcmUoJ3JlYWN0JylcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgYXBwICAgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgYmxvY2sgOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbGFiZWwgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgaWQgICAgOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsYXNzTmFtZSA6ICdjb2wtbWVudS1pdGVtJyxcbiAgICAgIHR5cGUgICAgICA6ICdidXR0b24nLFxuICAgICAgb25DbGljaygpIHt9LFxuICAgICAgaXNEaXNhYmxlZCgpIHt9XG4gICAgfVxuICB9LFxuXG4gIGlzRGlzYWJsZWQoKSB7XG4gICAgbGV0IHsgYXBwLCBibG9jaywgaXNEaXNhYmxlZCB9ID0gdGhpcy5wcm9wc1xuICAgIHJldHVybiBpc0Rpc2FibGVkKGFwcCwgYmxvY2spXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7IGxhYmVsLCBhcHAsIGJsb2NrLCBvbk9wZW4sIG9uRXhpdCwgYWN0aXZlLCBpc0Rpc2FibGVkLCBpdGVtcywgLi4uc2FmZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCdXR0b24geyAuLi5zYWZlIH0gb25DbGljaz17IHRoaXMuX29uQ2xpY2sgfSBkaXNhYmxlZD17IHRoaXMuaXNEaXNhYmxlZCgpIH0+XG4gICAgICAgIHsgbGFiZWwgfVxuICAgICAgPC9CdXR0b24+XG4gICAgKVxuICB9LFxuXG4gIF9vbkNsaWNrKCkge1xuICAgIGxldCB7IGFwcCwgYmxvY2ssIG9uQ2xpY2sgfSA9IHRoaXMucHJvcHNcbiAgICBvbkNsaWNrKGFwcCwgYmxvY2ssIHRoaXMpXG4gIH1cblxufSlcbiJdfQ==