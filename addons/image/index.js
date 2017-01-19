/**
 * Image Colonel Kurtz Addon
 * This component adds a basic image block type, including a
 * src, caption, and credit
 */

'use strict';

var Field = require('../common/field');
var Graphic = require('../common/graphic');
var Frame = require('../common/frame');
var React = require('react');

var Image = React.createClass({
  displayName: 'Image',

  getDefaultProps: function getDefaultProps() {
    return {
      content: { src: '' }
    };
  },

  render: function render() {
    var src = this.props.content.src;

    return React.createElement(
      'div',
      { className: 'col-img' },
      React.createElement(Field, { label: 'Image Source', type: 'url', value: src, name: 'image_src', onChange: this._onSrcChange }),
      this.props.children,
      React.createElement(
        Frame,
        { open: ('' + (src || '')).trim() },
        React.createElement(Graphic, { src: src, alt: '' })
      )
    );
  },

  _onSrcChange: function _onSrcChange(e) {
    this.props.onChange({
      src: e.currentTarget.value
    });
  }

});

module.exports = Image;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9pbWFnZS9pbmRleC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFNQSxJQUFJLEtBQUssR0FBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUN4QyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtBQUMxQyxJQUFJLEtBQUssR0FBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUN4QyxJQUFJLEtBQUssR0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRTlCLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUU1QixpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFdBQU87QUFDTCxhQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFO0tBQ3JCLENBQUE7R0FDRjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7UUFDRCxHQUFHLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQTFCLEdBQUc7O0FBRVQsV0FDRTs7UUFBSyxTQUFTLEVBQUMsU0FBUztNQUN0QixvQkFBQyxLQUFLLElBQUMsS0FBSyxFQUFDLGNBQWMsRUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBRyxHQUFHLEFBQUUsRUFBQyxJQUFJLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBRyxJQUFJLENBQUMsWUFBWSxBQUFFLEdBQUU7TUFDcEcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO01BQ3JCO0FBQUMsYUFBSztVQUFDLElBQUksRUFBRyxPQUFJLEdBQUcsSUFBSSxFQUFFLENBQUEsRUFBSSxJQUFJLEVBQUUsQUFBRTtRQUNyQyxvQkFBQyxPQUFPLElBQUMsR0FBRyxFQUFHLEdBQUcsQUFBRSxFQUFDLEdBQUcsRUFBQyxFQUFFLEdBQUc7T0FDeEI7S0FDSixDQUNQO0dBQ0Y7O0FBRUQsY0FBWSxFQUFBLHNCQUFDLENBQUMsRUFBRTtBQUNkLFFBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO0FBQ2xCLFNBQUcsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUs7S0FDM0IsQ0FBQyxDQUFBO0dBQ0g7O0NBRUYsQ0FBQyxDQUFBOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBJbWFnZSBDb2xvbmVsIEt1cnR6IEFkZG9uXG4gKiBUaGlzIGNvbXBvbmVudCBhZGRzIGEgYmFzaWMgaW1hZ2UgYmxvY2sgdHlwZSwgaW5jbHVkaW5nIGFcbiAqIHNyYywgY2FwdGlvbiwgYW5kIGNyZWRpdFxuICovXG5cbmxldCBGaWVsZCAgID0gcmVxdWlyZSgnLi4vY29tbW9uL2ZpZWxkJylcbmxldCBHcmFwaGljID0gcmVxdWlyZSgnLi4vY29tbW9uL2dyYXBoaWMnKVxubGV0IEZyYW1lICAgPSByZXF1aXJlKCcuLi9jb21tb24vZnJhbWUnKVxubGV0IFJlYWN0ICAgPSByZXF1aXJlKCdyZWFjdCcpXG5cbnZhciBJbWFnZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbnRlbnQ6IHsgc3JjOiAnJyB9XG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgeyBzcmMgfSA9IHRoaXMucHJvcHMuY29udGVudFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWltZ1wiPlxuICAgICAgICA8RmllbGQgbGFiZWw9XCJJbWFnZSBTb3VyY2VcIiB0eXBlPVwidXJsXCIgdmFsdWU9eyBzcmMgfSBuYW1lPVwiaW1hZ2Vfc3JjXCIgb25DaGFuZ2U9eyB0aGlzLl9vblNyY0NoYW5nZSB9Lz5cbiAgICAgICAgeyB0aGlzLnByb3BzLmNoaWxkcmVuIH1cbiAgICAgICAgPEZyYW1lIG9wZW49eyBgJHsgc3JjIHx8ICcnIH1gLnRyaW0oKSB9PlxuICAgICAgICAgIDxHcmFwaGljIHNyYz17IHNyYyB9IGFsdD1cIlwiIC8+XG4gICAgICAgIDwvRnJhbWU+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG5cbiAgX29uU3JjQ2hhbmdlKGUpIHtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHtcbiAgICAgIHNyYzogZS5jdXJyZW50VGFyZ2V0LnZhbHVlXG4gICAgfSlcbiAgfVxuXG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IEltYWdlXG4iXX0=