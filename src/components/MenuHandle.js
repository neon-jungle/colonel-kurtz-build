'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Btn = require('./Button');
var React = require('react');

module.exports = React.createClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'col-menu-handle',
      label: 'Open the menu for this block',
      type: 'button'
    };
  },

  render: function render() {
    var _props = this.props;
    var label = _props.label;

    var safe = _objectWithoutProperties(_props, ['label']);

    return React.createElement(
      Btn,
      safe,
      React.createElement(
        'span',
        { className: 'col-hidden' },
        label
      ),
      React.createElement(
        'svg',
        { width: '24', height: '24', viewBox: '0 0 24 24', 'aria-hidden': 'true' },
        React.createElement('path', { d: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' })
      )
    );
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL01lbnVIYW5kbGUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLEdBQUcsR0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUU1QixNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUVqQyxpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFdBQU87QUFDTCxlQUFTLEVBQUcsaUJBQWlCO0FBQzdCLFdBQUssRUFBTyw4QkFBOEI7QUFDMUMsVUFBSSxFQUFRLFFBQVE7S0FDckIsQ0FBQTtHQUNGOztBQUVELFFBQU0sRUFBQSxrQkFBRztpQkFDa0IsSUFBSSxDQUFDLEtBQUs7UUFBN0IsS0FBSyxVQUFMLEtBQUs7O1FBQUssSUFBSTs7QUFFcEIsV0FDRTtBQUFDLFNBQUc7TUFBTSxJQUFJO01BQ1o7O1VBQU0sU0FBUyxFQUFDLFlBQVk7UUFBRyxLQUFLO09BQVM7TUFDN0M7O1VBQUssS0FBSyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsSUFBSSxFQUFDLE9BQU8sRUFBQyxXQUFXLEVBQUMsZUFBWSxNQUFNO1FBQ2hFLDhCQUFNLENBQUMsRUFBQywrQ0FBK0MsR0FBRTtPQUNyRDtLQUNGLENBQ1A7R0FDRjs7Q0FFRixDQUFDLENBQUEiLCJmaWxlIjoiTWVudUhhbmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBCdG4gICA9IHJlcXVpcmUoJy4vQnV0dG9uJylcbmxldCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGFzc05hbWUgOiAnY29sLW1lbnUtaGFuZGxlJyxcbiAgICAgIGxhYmVsICAgICA6ICdPcGVuIHRoZSBtZW51IGZvciB0aGlzIGJsb2NrJyxcbiAgICAgIHR5cGUgICAgICA6ICdidXR0b24nXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBsYWJlbCwgLi4uc2FmZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCdG4geyAuLi5zYWZlIH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1oaWRkZW5cIj57IGxhYmVsIH08L3NwYW4+XG4gICAgICAgIDxzdmcgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMyAxOGgxOHYtMkgzdjJ6bTAtNWgxOHYtMkgzdjJ6bTAtN3YyaDE4VjZIM3pcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9CdG4+XG4gICAgKVxuICB9XG5cbn0pXG4iXX0=