'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Btn = require('../../src/components/Button');
var React = require('react');

module.exports = React.createClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'col-dialog-close',
      label: 'Close this dialog',
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
        React.createElement('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
      )
    );
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9kaWFsb2cvY2xvc2UuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLEdBQUcsR0FBSyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtBQUNsRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRTVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRWpDLGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLGVBQVMsRUFBRyxrQkFBa0I7QUFDOUIsV0FBSyxFQUFPLG1CQUFtQjtBQUMvQixVQUFJLEVBQVEsUUFBUTtLQUNyQixDQUFBO0dBQ0Y7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO2lCQUNrQixJQUFJLENBQUMsS0FBSztRQUE3QixLQUFLLFVBQUwsS0FBSzs7UUFBSyxJQUFJOztBQUVwQixXQUNFO0FBQUMsU0FBRztNQUFNLElBQUk7TUFDWjs7VUFBTSxTQUFTLEVBQUMsWUFBWTtRQUFHLEtBQUs7T0FBUztNQUM3Qzs7VUFBSyxLQUFLLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxlQUFZLE1BQU07UUFDaEUsOEJBQU0sQ0FBQyxFQUFDLHVHQUF1RyxHQUFFO09BQzdHO0tBQ0YsQ0FDUDtHQUNGOztDQUVGLENBQUMsQ0FBQSIsImZpbGUiOiJjbG9zZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBCdG4gICA9IHJlcXVpcmUoJy4uLy4uL3NyYy9jb21wb25lbnRzL0J1dHRvbicpXG5sZXQgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpXG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2xhc3NOYW1lIDogJ2NvbC1kaWFsb2ctY2xvc2UnLFxuICAgICAgbGFiZWwgICAgIDogJ0Nsb3NlIHRoaXMgZGlhbG9nJyxcbiAgICAgIHR5cGUgICAgICA6ICdidXR0b24nXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBsYWJlbCwgLi4uc2FmZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxCdG4geyAuLi5zYWZlIH0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1oaWRkZW5cIj57IGxhYmVsIH08L3NwYW4+XG4gICAgICAgIDxzdmcgd2lkdGg9XCIyNFwiIGhlaWdodD1cIjI0XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyelwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L0J0bj5cbiAgICApXG4gIH1cblxufSlcbiJdfQ==