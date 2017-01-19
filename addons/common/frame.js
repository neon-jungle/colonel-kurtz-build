'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var cx = require('classnames');

module.exports = React.createClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      element: 'figure'
    };
  },

  render: function render() {
    var _props = this.props;
    var element = _props.element;
    var children = _props.children;
    var open = _props.open;

    var other = _objectWithoutProperties(_props, ['element', 'children', 'open']);

    var className = cx('col-frame', {
      'col-frame-open': !!open
    });

    return React.createElement(element, _extends({ className: className }, other), children);
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9jb21tb24vZnJhbWUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM1QixJQUFJLEVBQUUsR0FBTSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRWpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRWpDLGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLGFBQU8sRUFBRSxRQUFRO0tBQ2xCLENBQUE7R0FDRjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7aUJBQ3FDLElBQUksQ0FBQyxLQUFLO1FBQWhELE9BQU8sVUFBUCxPQUFPO1FBQUUsUUFBUSxVQUFSLFFBQVE7UUFBRSxJQUFJLFVBQUosSUFBSTs7UUFBSyxLQUFLOztBQUV2QyxRQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFO0FBQzlCLHNCQUFnQixFQUFFLENBQUMsQ0FBQyxJQUFJO0tBQ3pCLENBQUMsQ0FBQTs7QUFFRixXQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxhQUFJLFNBQVMsRUFBVCxTQUFTLElBQUssS0FBSyxHQUFJLFFBQVEsQ0FBQyxDQUFBO0dBQ3ZFOztDQUVGLENBQUMsQ0FBQSIsImZpbGUiOiJmcmFtZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbmxldCBjeCAgICA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVsZW1lbnQ6ICdmaWd1cmUnXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgeyBlbGVtZW50LCBjaGlsZHJlbiwgb3BlbiwgLi4ub3RoZXIgfSA9IHRoaXMucHJvcHNcblxuICAgIGxldCBjbGFzc05hbWUgPSBjeCgnY29sLWZyYW1lJywge1xuICAgICAgJ2NvbC1mcmFtZS1vcGVuJzogISFvcGVuXG4gICAgfSlcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGVsZW1lbnQsIHsgY2xhc3NOYW1lLCAuLi5vdGhlciB9LCBjaGlsZHJlbilcbiAgfVxuXG59KVxuIl19