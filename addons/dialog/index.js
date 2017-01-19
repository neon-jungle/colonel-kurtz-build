'use strict';

var Close = require('./close');
var FocusTrap = require('react-focus-trap');
var React = require('react');

module.exports = React.createClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'col-dialog',
      headingComponent: 'h3'
    };
  },

  getTitle: function getTitle() {
    var _props = this.props;
    var headingComponent = _props.headingComponent;
    var title = _props.title;

    if (title) {
      return React.createElement(headingComponent, {
        className: "col-dialog-title"
      }, title);
    }
  },

  render: function render() {
    var _props2 = this.props;
    var active = _props2.active;
    var children = _props2.children;
    var className = _props2.className;
    var onExit = _props2.onExit;

    return React.createElement(
      FocusTrap,
      { active: active, className: className, onExit: onExit },
      this.getTitle(),
      children,
      React.createElement(Close, { onClick: onExit })
    );
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9kaWFsb2cvaW5kZXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxLQUFLLEdBQU8sT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO0FBQzNDLElBQUksS0FBSyxHQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFaEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFakMsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsZUFBUyxFQUFVLFlBQVk7QUFDL0Isc0JBQWdCLEVBQUcsSUFBSTtLQUN4QixDQUFBO0dBQ0Y7O0FBRUQsVUFBUSxFQUFBLG9CQUFHO2lCQUN5QixJQUFJLENBQUMsS0FBSztRQUF0QyxnQkFBZ0IsVUFBaEIsZ0JBQWdCO1FBQUUsS0FBSyxVQUFMLEtBQUs7O0FBQzdCLFFBQUksS0FBSyxFQUFFO0FBQ1QsYUFBTyxLQUFLLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFO0FBQzNDLGlCQUFTLEVBQUUsa0JBQWtCO09BQzlCLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDVjtHQUNGOztBQUVELFFBQU0sRUFBQSxrQkFBRztrQkFDdUMsSUFBSSxDQUFDLEtBQUs7UUFBbEQsTUFBTSxXQUFOLE1BQU07UUFBRSxRQUFRLFdBQVIsUUFBUTtRQUFFLFNBQVMsV0FBVCxTQUFTO1FBQUUsTUFBTSxXQUFOLE1BQU07O0FBRXpDLFdBQ0U7QUFBQyxlQUFTO1FBQUMsTUFBTSxFQUFHLE1BQU0sQUFBRSxFQUFDLFNBQVMsRUFBRyxTQUFTLEFBQUUsRUFBQyxNQUFNLEVBQUcsTUFBTSxBQUFFO01BQ2xFLElBQUksQ0FBQyxRQUFRLEVBQUU7TUFDZixRQUFRO01BQ1Ysb0JBQUMsS0FBSyxJQUFDLE9BQU8sRUFBRyxNQUFNLEFBQUUsR0FBRztLQUNsQixDQUNiO0dBQ0Y7O0NBRUYsQ0FBQyxDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IENsb3NlICAgICA9IHJlcXVpcmUoJy4vY2xvc2UnKVxubGV0IEZvY3VzVHJhcCA9IHJlcXVpcmUoJ3JlYWN0LWZvY3VzLXRyYXAnKVxubGV0IFJlYWN0ICAgICA9IHJlcXVpcmUoJ3JlYWN0JylcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGFzc05hbWUgICAgICAgIDogJ2NvbC1kaWFsb2cnLFxuICAgICAgaGVhZGluZ0NvbXBvbmVudCA6ICdoMydcbiAgICB9XG4gIH0sXG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgbGV0IHsgaGVhZGluZ0NvbXBvbmVudCwgdGl0bGUgfSA9IHRoaXMucHJvcHNcbiAgICBpZiAodGl0bGUpIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGhlYWRpbmdDb21wb25lbnQsIHtcbiAgICAgICAgY2xhc3NOYW1lOiBcImNvbC1kaWFsb2ctdGl0bGVcIlxuICAgICAgfSwgdGl0bGUpXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBhY3RpdmUsIGNoaWxkcmVuLCBjbGFzc05hbWUsIG9uRXhpdCB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGb2N1c1RyYXAgYWN0aXZlPXsgYWN0aXZlIH0gY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0gb25FeGl0PXsgb25FeGl0IH0+XG4gICAgICAgIHsgdGhpcy5nZXRUaXRsZSgpIH1cbiAgICAgICAgeyBjaGlsZHJlbiB9XG4gICAgICAgIDxDbG9zZSBvbkNsaWNrPXsgb25FeGl0IH0gLz5cbiAgICAgIDwvRm9jdXNUcmFwPlxuICAgIClcbiAgfVxuXG59KVxuIl19