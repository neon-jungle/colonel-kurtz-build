'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var Ink = require('react-ink');

module.exports = React.createClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'col-btn',
      tagName: 'button',
      type: 'button'
    };
  },

  render: function render() {
    var _props = this.props;
    var children = _props.children;
    var tagName = _props.tagName;

    var attrs = _objectWithoutProperties(_props, ['children', 'tagName']);

    return React.createElement(tagName, attrs, [React.createElement(Ink, { key: '__ink__' }), children]);
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0J1dHRvbi5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM1QixJQUFJLEdBQUcsR0FBSyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0FBRWhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRWpDLGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLGVBQVMsRUFBRyxTQUFTO0FBQ3JCLGFBQU8sRUFBSyxRQUFRO0FBQ3BCLFVBQUksRUFBUSxRQUFRO0tBQ3JCLENBQUE7R0FDRjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7aUJBQytCLElBQUksQ0FBQyxLQUFLO1FBQTFDLFFBQVEsVUFBUixRQUFRO1FBQUUsT0FBTyxVQUFQLE9BQU87O1FBQUssS0FBSzs7QUFFakMsV0FBTyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FDekMsb0JBQUMsR0FBRyxJQUFDLEdBQUcsRUFBQyxTQUFTLEdBQUUsRUFDcEIsUUFBUSxDQUNULENBQUMsQ0FBQTtHQUNIOztDQUVGLENBQUMsQ0FBQSIsImZpbGUiOiJCdXR0b24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpXG5sZXQgSW5rICAgPSByZXF1aXJlKCdyZWFjdC1pbmsnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNsYXNzTmFtZSA6ICdjb2wtYnRuJyxcbiAgICAgIHRhZ05hbWUgICA6ICdidXR0b24nLFxuICAgICAgdHlwZSAgICAgIDogJ2J1dHRvbidcbiAgICB9XG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7IGNoaWxkcmVuLCB0YWdOYW1lLCAuLi5hdHRycyB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSwgYXR0cnMsIFtcbiAgICAgIDxJbmsga2V5PVwiX19pbmtfX1wiLz4sXG4gICAgICBjaGlsZHJlblxuICAgIF0pXG4gIH1cblxufSlcbiJdfQ==