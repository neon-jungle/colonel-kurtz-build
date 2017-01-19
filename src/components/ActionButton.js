'use strict';

var Btn = require('./Button');
var React = require('react');
var DOM = require('react-dom');

module.exports = React.createClass({
  displayName: 'exports',

  propTypes: {
    label: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'col-btn-fab',
      symbol: '+'
    };
  },

  focus: function focus() {
    DOM.findDOMNode(this).focus();
  },

  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var disabled = _props.disabled;
    var label = _props.label;
    var onClick = _props.onClick;
    var symbol = _props.symbol;

    return React.createElement(
      Btn,
      { className: className, onClick: onClick, disabled: disabled },
      React.createElement(
        'span',
        { className: 'col-hidden' },
        label
      ),
      React.createElement(
        'span',
        { 'aria-hidden': 'true' },
        symbol
      )
    );
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0FjdGlvbkJ1dHRvbi5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLEdBQUcsR0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDL0IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLElBQUksR0FBRyxHQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTs7QUFFaEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFakMsV0FBUyxFQUFFO0FBQ1QsU0FBSyxFQUFLLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDM0MsV0FBTyxFQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7R0FDMUM7O0FBRUQsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsZUFBUyxFQUFHLGFBQWE7QUFDekIsWUFBTSxFQUFNLEdBQUc7S0FDaEIsQ0FBQTtHQUNGOztBQUVELE9BQUssRUFBQSxpQkFBRztBQUNOLE9BQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7R0FDOUI7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO2lCQUMrQyxJQUFJLENBQUMsS0FBSztRQUExRCxTQUFTLFVBQVQsU0FBUztRQUFFLFFBQVEsVUFBUixRQUFRO1FBQUUsS0FBSyxVQUFMLEtBQUs7UUFBRSxPQUFPLFVBQVAsT0FBTztRQUFFLE1BQU0sVUFBTixNQUFNOztBQUVqRCxXQUNFO0FBQUMsU0FBRztRQUFDLFNBQVMsRUFBRyxTQUFTLEFBQUUsRUFBQyxPQUFPLEVBQUcsT0FBTyxBQUFFLEVBQUMsUUFBUSxFQUFHLFFBQVEsQUFBRTtNQUNwRTs7VUFBTSxTQUFTLEVBQUMsWUFBWTtRQUFHLEtBQUs7T0FBUztNQUM3Qzs7VUFBTSxlQUFZLE1BQU07UUFBRyxNQUFNO09BQVM7S0FDdEMsQ0FDUDtHQUNGOztDQUVGLENBQUMsQ0FBQSIsImZpbGUiOiJBY3Rpb25CdXR0b24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgQnRuICAgPSByZXF1aXJlKCcuL0J1dHRvbicpXG5sZXQgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpXG5sZXQgRE9NICAgPSByZXF1aXJlKCdyZWFjdC1kb20nKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBwcm9wVHlwZXM6IHtcbiAgICBsYWJlbCAgIDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG9uQ2xpY2sgOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGFzc05hbWUgOiAnY29sLWJ0bi1mYWInLFxuICAgICAgc3ltYm9sICAgIDogJysnXG4gICAgfVxuICB9LFxuXG4gIGZvY3VzKCkge1xuICAgIERPTS5maW5kRE9NTm9kZSh0aGlzKS5mb2N1cygpXG4gIH0sXG5cbiAgcmVuZGVyKCkge1xuICAgIGxldCB7IGNsYXNzTmFtZSwgZGlzYWJsZWQsIGxhYmVsLCBvbkNsaWNrLCBzeW1ib2wgfSA9IHRoaXMucHJvcHNcblxuICAgIHJldHVybiAoXG4gICAgICA8QnRuIGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9IG9uQ2xpY2s9eyBvbkNsaWNrIH0gZGlzYWJsZWQ9eyBkaXNhYmxlZCB9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJjb2wtaGlkZGVuXCI+eyBsYWJlbCB9PC9zcGFuPlxuICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj57IHN5bWJvbCB9PC9zcGFuPlxuICAgICAgPC9CdG4+XG4gICAgKVxuICB9XG5cbn0pXG4iXX0=