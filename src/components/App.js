/**
 * This is the root component that contains sections for
 * toggling between viewing modes and viewing managed content
 */

'use strict';

var Animator = require('./Animator');
var Blocks = require('../stores/Blocks');
var EditorBlock = require('./EditorBlock');
var React = require('react');
var Switch = require('./Switch');

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    app: React.PropTypes.object.isRequired
  },

  getBlock: function getBlock(block, i) {
    return React.createElement(EditorBlock, { key: block, app: this.props.app, block: block });
  },

  render: function render() {
    var app = this.props.app;

    var parents = Blocks.filterChildren(app.state.blocks);

    return React.createElement(
      'div',
      { className: 'colonel' },
      React.createElement(Switch, { app: app }),
      React.createElement(
        Animator,
        { className: 'col-block-children' },
        parents.map(this.getBlock)
      )
    );
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0FwcC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBLElBQUksUUFBUSxHQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN2QyxJQUFJLE1BQU0sR0FBUSxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUM3QyxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUE7QUFDMUMsSUFBSSxLQUFLLEdBQVMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ2xDLElBQUksTUFBTSxHQUFRLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTs7QUFFckMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFakMsV0FBUyxFQUFFO0FBQ1QsT0FBRyxFQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7R0FDeEM7O0FBRUQsVUFBUSxFQUFBLGtCQUFDLEtBQUssRUFBRSxDQUFDLEVBQUU7QUFDakIsV0FBUSxvQkFBQyxXQUFXLElBQUMsR0FBRyxFQUFHLEtBQUssQUFBRSxFQUFDLEdBQUcsRUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQUFBRSxFQUFDLEtBQUssRUFBRyxLQUFLLEFBQUUsR0FBRyxDQUFDO0dBQzlFOztBQUVELFFBQU0sRUFBQSxrQkFBRztRQUNELEdBQUcsR0FBSyxJQUFJLENBQUMsS0FBSyxDQUFsQixHQUFHOztBQUVULFFBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFckQsV0FDRTs7UUFBSyxTQUFTLEVBQUMsU0FBUztNQUN0QixvQkFBQyxNQUFNLElBQUMsR0FBRyxFQUFHLEdBQUcsQUFBRSxHQUFHO01BQ3RCO0FBQUMsZ0JBQVE7VUFBQyxTQUFTLEVBQUMsb0JBQW9CO1FBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztPQUNuQjtLQUNQLENBQ1A7R0FDRjs7Q0FFRixDQUFDLENBQUEiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGlzIGlzIHRoZSByb290IGNvbXBvbmVudCB0aGF0IGNvbnRhaW5zIHNlY3Rpb25zIGZvclxuICogdG9nZ2xpbmcgYmV0d2VlbiB2aWV3aW5nIG1vZGVzIGFuZCB2aWV3aW5nIG1hbmFnZWQgY29udGVudFxuICovXG5cbmxldCBBbmltYXRvciAgICA9IHJlcXVpcmUoJy4vQW5pbWF0b3InKVxubGV0IEJsb2NrcyAgICAgID0gcmVxdWlyZSgnLi4vc3RvcmVzL0Jsb2NrcycpXG5sZXQgRWRpdG9yQmxvY2sgPSByZXF1aXJlKCcuL0VkaXRvckJsb2NrJylcbmxldCBSZWFjdCAgICAgICA9IHJlcXVpcmUoJ3JlYWN0JylcbmxldCBTd2l0Y2ggICAgICA9IHJlcXVpcmUoJy4vU3dpdGNoJylcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcHJvcFR5cGVzOiB7XG4gICAgYXBwIDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0QmxvY2soYmxvY2ssIGkpIHtcbiAgICByZXR1cm4gKDxFZGl0b3JCbG9jayBrZXk9eyBibG9jayB9IGFwcD17IHRoaXMucHJvcHMuYXBwIH0gYmxvY2s9eyBibG9jayB9IC8+KVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBhcHAgfSA9IHRoaXMucHJvcHNcblxuICAgIGxldCBwYXJlbnRzID0gQmxvY2tzLmZpbHRlckNoaWxkcmVuKGFwcC5zdGF0ZS5ibG9ja3MpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2xvbmVsXCI+XG4gICAgICAgIDxTd2l0Y2ggYXBwPXsgYXBwIH0gLz5cbiAgICAgICAgPEFuaW1hdG9yIGNsYXNzTmFtZT1cImNvbC1ibG9jay1jaGlsZHJlblwiPlxuICAgICAgICAgIHsgcGFyZW50cy5tYXAodGhpcy5nZXRCbG9jaykgfVxuICAgICAgICA8L0FuaW1hdG9yPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbn0pXG4iXX0=