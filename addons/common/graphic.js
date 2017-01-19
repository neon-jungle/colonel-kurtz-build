'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');

module.exports = React.createClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      className: 'col-graphic',
      element: 'img',
      src: null
    };
  },

  render: function render() {
    var _props = this.props;
    var element = _props.element;

    var other = _objectWithoutProperties(_props, ['element']);

    return React.createElement(element, other);
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9jb21tb24vZ3JhcGhpYy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFNUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFakMsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsZUFBUyxFQUFHLGFBQWE7QUFDekIsYUFBTyxFQUFLLEtBQUs7QUFDakIsU0FBRyxFQUFTLElBQUk7S0FDakIsQ0FBQTtHQUNGOztBQUVELFFBQU0sRUFBQSxrQkFBRztpQkFDcUIsSUFBSSxDQUFDLEtBQUs7UUFBaEMsT0FBTyxVQUFQLE9BQU87O1FBQUssS0FBSzs7QUFDdkIsV0FBTyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQTtHQUMzQzs7Q0FFRixDQUFDLENBQUEiLCJmaWxlIjoiZ3JhcGhpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjbGFzc05hbWUgOiAnY29sLWdyYXBoaWMnLFxuICAgICAgZWxlbWVudCAgIDogJ2ltZycsXG4gICAgICBzcmMgICAgICAgOiBudWxsXG4gICAgfVxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgeyBlbGVtZW50LCAuLi5vdGhlciB9ID0gdGhpcy5wcm9wc1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KGVsZW1lbnQsIG90aGVyKVxuICB9XG5cbn0pXG4iXX0=