'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Animator = require('./Animator');
var FocusTrap = require('react-focus-trap');
var Handle = require('./MenuHandle');
var Item = require('./MenuItem');
var React = require('react');
var menuItems = require('../config/menu');

module.exports = React.createClass({
  displayName: 'exports',

  statics: { Item: Item },

  propTypes: {
    app: React.PropTypes.object.isRequired,
    block: React.PropTypes.object.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      items: []
    };
  },

  getMenuItem: function getMenuItem(item) {
    var id = item.id;

    return React.createElement(Item, _extends({ key: id, ref: id }, item, this.props));
  },

  getMenuItems: function getMenuItems() {
    return this.props.items.concat(menuItems).map(this.getMenuItem);
  },

  getMenu: function getMenu() {
    if (!this.props.active) return null;

    return React.createElement(FocusTrap, {
      active: true,
      key: 'menu',
      className: 'col-menu',
      element: 'nav',
      onExit: this.props.onExit,
      role: 'navigation'
    }, this.getMenuItems());
  },

  render: function render() {
    return React.createElement(
      Animator,
      { className: 'col-menu-wrapper', transitionName: 'col-menu', transitionEnterTimeout: 300, transitionLeaveTimeout: 200 },
      React.createElement(Handle, { key: 'handle', ref: 'handle', onClick: this.props.onOpen }),
      this.getMenu()
    );
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0Jsb2NrTWVudS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksUUFBUSxHQUFJLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUMzQyxJQUFJLE1BQU0sR0FBTSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdkMsSUFBSSxJQUFJLEdBQVEsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3JDLElBQUksS0FBSyxHQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNoQyxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTs7QUFFekMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFakMsU0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRTs7QUFFakIsV0FBUyxFQUFFO0FBQ1QsT0FBRyxFQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDMUMsU0FBSyxFQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7R0FDM0M7O0FBRUQsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsV0FBSyxFQUFFLEVBQUU7S0FDVixDQUFBO0dBQ0Y7O0FBRUQsYUFBVyxFQUFBLHFCQUFDLElBQUksRUFBRTtRQUNWLEVBQUUsR0FBSyxJQUFJLENBQVgsRUFBRTs7QUFDUixXQUFRLG9CQUFDLElBQUksYUFBQyxHQUFHLEVBQUcsRUFBRSxBQUFFLEVBQUMsR0FBRyxFQUFHLEVBQUUsQUFBRSxJQUFNLElBQUksRUFBUSxJQUFJLENBQUMsS0FBSyxFQUFLLENBQUM7R0FDdEU7O0FBRUQsY0FBWSxFQUFBLHdCQUFHO0FBQ2IsV0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQTtHQUNoRTs7QUFFRCxTQUFPLEVBQUEsbUJBQUc7QUFDUixRQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxJQUFJLENBQUM7O0FBRXBDLFdBQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUU7QUFDcEMsWUFBTSxFQUFNLElBQUk7QUFDaEIsU0FBRyxFQUFTLE1BQU07QUFDbEIsZUFBUyxFQUFHLFVBQVU7QUFDdEIsYUFBTyxFQUFLLEtBQUs7QUFDakIsWUFBTSxFQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtBQUM3QixVQUFJLEVBQVEsWUFBWTtLQUN6QixFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBO0dBQ3hCOztBQUVELFFBQU0sRUFBQSxrQkFBRztBQUNQLFdBQ0U7QUFBQyxjQUFRO1FBQUMsU0FBUyxFQUFDLGtCQUFrQixFQUFDLGNBQWMsRUFBQyxVQUFVLEVBQUMsc0JBQXNCLEVBQUcsR0FBRyxBQUFFLEVBQUMsc0JBQXNCLEVBQUcsR0FBRyxBQUFFO01BQzVILG9CQUFDLE1BQU0sSUFBQyxHQUFHLEVBQUMsUUFBUSxFQUFDLEdBQUcsRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFFLEdBQUU7TUFDL0QsSUFBSSxDQUFDLE9BQU8sRUFBRTtLQUNQLENBQ1o7R0FDRjs7Q0FFRixDQUFDLENBQUEiLCJmaWxlIjoiQmxvY2tNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEFuaW1hdG9yICA9IHJlcXVpcmUoJy4vQW5pbWF0b3InKVxubGV0IEZvY3VzVHJhcCA9IHJlcXVpcmUoJ3JlYWN0LWZvY3VzLXRyYXAnKVxubGV0IEhhbmRsZSAgICA9IHJlcXVpcmUoJy4vTWVudUhhbmRsZScpXG5sZXQgSXRlbSAgICAgID0gcmVxdWlyZSgnLi9NZW51SXRlbScpXG5sZXQgUmVhY3QgICAgID0gcmVxdWlyZSgncmVhY3QnKVxubGV0IG1lbnVJdGVtcyA9IHJlcXVpcmUoJy4uL2NvbmZpZy9tZW51JylcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgc3RhdGljczogeyBJdGVtIH0sXG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgYXBwICAgIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGJsb2NrICA6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IFtdXG4gICAgfVxuICB9LFxuXG4gIGdldE1lbnVJdGVtKGl0ZW0pIHtcbiAgICBsZXQgeyBpZCB9ID0gaXRlbVxuICAgIHJldHVybiAoPEl0ZW0ga2V5PXsgaWQgfSByZWY9eyBpZCB9IHsgLi4uaXRlbSB9IHsgLi4udGhpcy5wcm9wcyB9IC8+KVxuICB9LFxuXG4gIGdldE1lbnVJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5pdGVtcy5jb25jYXQobWVudUl0ZW1zKS5tYXAodGhpcy5nZXRNZW51SXRlbSlcbiAgfSxcblxuICBnZXRNZW51KCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5hY3RpdmUpIHJldHVybiBudWxsO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9jdXNUcmFwLCB7XG4gICAgICBhY3RpdmUgICAgOiB0cnVlLFxuICAgICAga2V5ICAgICAgIDogJ21lbnUnLFxuICAgICAgY2xhc3NOYW1lIDogJ2NvbC1tZW51JyxcbiAgICAgIGVsZW1lbnQgICA6ICduYXYnLFxuICAgICAgb25FeGl0ICAgIDogdGhpcy5wcm9wcy5vbkV4aXQsXG4gICAgICByb2xlICAgICAgOiAnbmF2aWdhdGlvbidcbiAgICB9LCB0aGlzLmdldE1lbnVJdGVtcygpKVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEFuaW1hdG9yIGNsYXNzTmFtZT1cImNvbC1tZW51LXdyYXBwZXJcIiB0cmFuc2l0aW9uTmFtZT1cImNvbC1tZW51XCIgdHJhbnNpdGlvbkVudGVyVGltZW91dD17IDMwMCB9IHRyYW5zaXRpb25MZWF2ZVRpbWVvdXQ9eyAyMDAgfT5cbiAgICAgICAgPEhhbmRsZSBrZXk9XCJoYW5kbGVcIiByZWY9XCJoYW5kbGVcIiBvbkNsaWNrPXsgdGhpcy5wcm9wcy5vbk9wZW4gfS8+XG4gICAgICAgIHsgdGhpcy5nZXRNZW51KCkgfVxuICAgICAgPC9BbmltYXRvcj5cbiAgICApXG4gIH1cblxufSlcbiJdfQ==