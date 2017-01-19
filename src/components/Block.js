'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Actions = require('../actions/blocks');
var Animator = require('./Animator');
var BlockMenu = require('./BlockMenu');
var FallbackBlockType = require('../models/FallbackBlockType');
var Switch = require('./Switch');
var respondsTo = require('../utils/respondsTo');
var menuItems = require('../config/menu');

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    app: React.PropTypes.object.isRequired,
    block: React.PropTypes.object.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      extraMenuItems: [],
      menuOpen: false
    };
  },

  getBlockType: function getBlockType() {
    var _props = this.props;
    var app = _props.app;
    var block = _props.block;

    var blockType = app.state.blockTypes.filter(function (i) {
      return i.id === block.type;
    })[0];

    return blockType ? blockType : new FallbackBlockType({ block: block });
  },

  getMenuItems: function getMenuItems() {
    return this.state.extraMenuItems;
  },

  setMenuItems: function setMenuItems(component) {
    if (respondsTo(component, 'getMenuItems')) {
      this.setState({ extraMenuItems: component.getMenuItems() });
    }
  },

  openMenu: function openMenu() {
    this.setState({ menuOpen: true });
  },

  closeMenu: function closeMenu() {
    this.setState({ menuOpen: false });
  },

  componentDidMount: function componentDidMount() {
    this.setMenuItems(this.refs.block);

    // Trigger an initial change to ensure default content
    // is assigned immediately
    this._onChange(this.getContent(this.props.block));
  },

  getContent: function getContent(block) {
    var _getBlockType = this.getBlockType();

    var component = _getBlockType.component;

    var defaults = typeof component.getDefaultProps === 'function' ? component.getDefaultProps() : {};

    return _extends({}, defaults.content, block.content);
  },

  render: function render() {
    var _props2 = this.props;
    var app = _props2.app;
    var block = _props2.block;
    var children = _props2.children;

    var _getBlockType2 = this.getBlockType();

    var Component = _getBlockType2.component;
    var _state = this.state;
    var menuOpen = _state.menuOpen;
    var extraMenuItems = _state.extraMenuItems;

    // Determine content by taking the default content and extend it with
    // the current block content
    var content = this.getContent(block);

    return React.createElement(
      'div',
      { className: 'col-editor-block' },
      React.createElement(
        'div',
        { className: 'col-block col-block-' + block.type },
        React.createElement(
          Component,
          _extends({ ref: 'block' }, block, { app: app, block: block, content: content, menuItems: menuItems, onChange: this._onChange }),
          React.createElement(Switch, { app: app, parent: block }),
          React.createElement(
            Animator,
            { className: 'col-block-children' },
            children
          )
        ),
        React.createElement(BlockMenu, { ref: 'menu', app: app, block: block, items: extraMenuItems, active: menuOpen, onOpen: this.openMenu, onExit: this.closeMenu })
      ),
      React.createElement(Switch, { app: app, position: block, parent: block.parent })
    );
  },

  _onChange: function _onChange(content) {
    var _props3 = this.props;
    var app = _props3.app;
    var block = _props3.block;

    app.push(Actions.update, [block, content]);
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0Jsb2NrLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSSxLQUFLLEdBQWUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3hDLElBQUksT0FBTyxHQUFhLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3BELElBQUksUUFBUSxHQUFZLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUM3QyxJQUFJLFNBQVMsR0FBVyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDOUMsSUFBSSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtBQUM5RCxJQUFJLE1BQU0sR0FBYyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDM0MsSUFBSSxVQUFVLEdBQVUsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDdEQsSUFBSSxTQUFTLEdBQVcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRWpELE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRWpDLFdBQVMsRUFBRTtBQUNULE9BQUcsRUFBSyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0FBQ3pDLFNBQUssRUFBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVO0dBQzFDOztBQUVELGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLG9CQUFjLEVBQUcsRUFBRTtBQUNuQixjQUFRLEVBQVMsS0FBSztLQUN2QixDQUFBO0dBQ0Y7O0FBRUQsY0FBWSxFQUFBLHdCQUFHO2lCQUNRLElBQUksQ0FBQyxLQUFLO1FBQXpCLEdBQUcsVUFBSCxHQUFHO1FBQUUsS0FBSyxVQUFMLEtBQUs7O0FBRWhCLFFBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLENBQUMs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QVEsQUFBRSxFQUFDLE1BQU0sRUFBRyxJQUFJLENBQUMsU0FBUyxBQUFFLEdBQUc7T0FDaEo7TUFFTixvQkFBQyxNQUFNLElBQUMsR0FBRyxFQUFHLEdBQUcsQUFBRSxFQUFDLFFBQVEsRUFBRyxLQUFLLEFBQUUsRUFBQyxNQUFNLEVBQUcsS0FBSyxDQUFDLE1BQU0sQUFBRSxHQUFHO0tBQzdELENBQ1A7R0FDRjs7QUFFRCxXQUFTLEVBQUEsbUJBQUMsT0FBTyxFQUFFO2tCQUNJLElBQUksQ0FBQyxLQUFLO1FBQXpCLEdBQUcsV0FBSCxHQUFHO1FBQUUsS0FBSyxXQUFMLEtBQUs7O0FBQ2hCLE9BQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO0dBQzNDO0NBQ0YsQ0FBQyxDQUFBIiwiZmlsZSI6IkJsb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IFJlYWN0ICAgICAgICAgICAgID0gcmVxdWlyZSgncmVhY3QnKVxubGV0IEFjdGlvbnMgICAgICAgICAgID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9ibG9ja3MnKVxubGV0IEFuaW1hdG9yICAgICAgICAgID0gcmVxdWlyZSgnLi9BbmltYXRvcicpXG5sZXQgQmxvY2tNZW51ICAgICAgICAgPSByZXF1aXJlKCcuL0Jsb2NrTWVudScpXG5sZXQgRmFsbGJhY2tCbG9ja1R5cGUgPSByZXF1aXJlKCcuLi9tb2RlbHMvRmFsbGJhY2tCbG9ja1R5cGUnKVxubGV0IFN3aXRjaCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9Td2l0Y2gnKVxubGV0IHJlc3BvbmRzVG8gICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbHMvcmVzcG9uZHNUbycpXG5sZXQgbWVudUl0ZW1zICAgICAgICAgPSByZXF1aXJlKCcuLi9jb25maWcvbWVudScpXG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIHByb3BUeXBlczoge1xuICAgIGFwcCAgIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGJsb2NrIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBleHRyYU1lbnVJdGVtcyA6IFtdLFxuICAgICAgbWVudU9wZW4gICAgICAgOiBmYWxzZVxuICAgIH1cbiAgfSxcblxuICBnZXRCbG9ja1R5cGUoKSB7XG4gICAgbGV0IHsgYXBwLCBibG9jayB9ID0gdGhpcy5wcm9wc1xuXG4gICAgbGV0IGJsb2NrVHlwZSA9IGFwcC5zdGF0ZS5ibG9ja1R5cGVzLmZpbHRlcihpID0+IGkuaWQgPT09IGJsb2NrLnR5cGUpWzBdXG5cbiAgICByZXR1cm4gYmxvY2tUeXBlID8gYmxvY2tUeXBlIDogbmV3IEZhbGxiYWNrQmxvY2tUeXBlKHsgYmxvY2sgfSlcbiAgfSxcblxuICBnZXRNZW51SXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZXh0cmFNZW51SXRlbXNcbiAgfSxcblxuICBzZXRNZW51SXRlbXMoY29tcG9uZW50KSB7XG4gICAgaWYgKHJlc3BvbmRzVG8oY29tcG9uZW50LCAnZ2V0TWVudUl0ZW1zJykpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBleHRyYU1lbnVJdGVtczogY29tcG9uZW50LmdldE1lbnVJdGVtcygpIH0pXG4gICAgfVxuICB9LFxuXG4gIG9wZW5NZW51KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBtZW51T3BlbjogdHJ1ZSB9KVxuICB9LFxuXG4gIGNsb3NlTWVudSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgbWVudU9wZW46IGZhbHNlIH0pXG4gIH0sXG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zZXRNZW51SXRlbXModGhpcy5yZWZzLmJsb2NrKVxuXG4gICAgLy8gVHJpZ2dlciBhbiBpbml0aWFsIGNoYW5nZSB0byBlbnN1cmUgZGVmYXVsdCBjb250ZW50XG4gICAgLy8gaXMgYXNzaWduZWQgaW1tZWRpYXRlbHlcbiAgICB0aGlzLl9vbkNoYW5nZSh0aGlzLmdldENvbnRlbnQodGhpcy5wcm9wcy5ibG9jaykpXG4gIH0sXG5cbiAgZ2V0Q29udGVudChibG9jaykge1xuICAgIGxldCB7IGNvbXBvbmVudCB9ID0gdGhpcy5nZXRCbG9ja1R5cGUoKVxuICAgIGxldCBkZWZhdWx0cyA9IHR5cGVvZiBjb21wb25lbnQuZ2V0RGVmYXVsdFByb3BzID09PSAnZnVuY3Rpb24nID8gY29tcG9uZW50LmdldERlZmF1bHRQcm9wcygpIDoge31cblxuICAgIHJldHVybiB7IC4uLmRlZmF1bHRzLmNvbnRlbnQsIC4uLmJsb2NrLmNvbnRlbnQgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBhcHAsIGJsb2NrLCBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wc1xuICAgIGxldCB7IGNvbXBvbmVudDpDb21wb25lbnQgfSA9IHRoaXMuZ2V0QmxvY2tUeXBlKClcbiAgICBsZXQgeyBtZW51T3BlbiwgZXh0cmFNZW51SXRlbXMgfSA9IHRoaXMuc3RhdGVcblxuICAgIC8vIERldGVybWluZSBjb250ZW50IGJ5IHRha2luZyB0aGUgZGVmYXVsdCBjb250ZW50IGFuZCBleHRlbmQgaXQgd2l0aFxuICAgIC8vIHRoZSBjdXJyZW50IGJsb2NrIGNvbnRlbnRcbiAgICBsZXQgY29udGVudCA9IHRoaXMuZ2V0Q29udGVudChibG9jaylcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1lZGl0b3ItYmxvY2tcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9eyBgY29sLWJsb2NrIGNvbC1ibG9jay0keyBibG9jay50eXBlIH1gIH0+XG4gICAgICAgICAgPENvbXBvbmVudCByZWY9XCJibG9ja1wiIHsgLi4uYmxvY2sgfSAgYXBwPXsgYXBwIH0gYmxvY2s9eyBibG9jayB9IGNvbnRlbnQ9eyBjb250ZW50IH0gbWVudUl0ZW1zPXsgbWVudUl0ZW1zIH0gb25DaGFuZ2U9eyB0aGlzLl9vbkNoYW5nZSB9ID5cbiAgICAgICAgICAgIDxTd2l0Y2ggYXBwPXsgYXBwIH0gcGFyZW50PXsgYmxvY2sgfSAvPlxuICAgICAgICAgICAgPEFuaW1hdG9yIGNsYXNzTmFtZT1cImNvbC1ibG9jay1jaGlsZHJlblwiPlxuICAgICAgICAgICAgICB7IGNoaWxkcmVuIH1cbiAgICAgICAgICAgIDwvQW5pbWF0b3I+XG4gICAgICAgICAgPC9Db21wb25lbnQ+XG5cbiAgICAgICAgICA8QmxvY2tNZW51IHJlZj1cIm1lbnVcIiBhcHA9eyBhcHAgfSBibG9jaz17IGJsb2NrIH0gaXRlbXM9eyBleHRyYU1lbnVJdGVtcyB9IGFjdGl2ZT17IG1lbnVPcGVuIH0gb25PcGVuPXsgdGhpcy5vcGVuTWVudSB9IG9uRXhpdD17IHRoaXMuY2xvc2VNZW51IH0gLz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPFN3aXRjaCBhcHA9eyBhcHAgfSBwb3NpdGlvbj17IGJsb2NrIH0gcGFyZW50PXsgYmxvY2sucGFyZW50IH0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcblxuICBfb25DaGFuZ2UoY29udGVudCkge1xuICAgIGxldCB7IGFwcCwgYmxvY2sgfSA9IHRoaXMucHJvcHNcbiAgICBhcHAucHVzaChBY3Rpb25zLnVwZGF0ZSwgW2Jsb2NrLCBjb250ZW50XSlcbiAgfVxufSlcbiJdfQ==