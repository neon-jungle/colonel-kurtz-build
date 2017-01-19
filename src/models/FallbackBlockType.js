/**
 * A fallback block type
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _BlockType2 = require('./BlockType');

var _BlockType3 = _interopRequireDefault(_BlockType2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var FallbackBlockType = (function (_BlockType) {
  _inherits(FallbackBlockType, _BlockType);

  function FallbackBlockType(_ref) {
    var block = _ref.block;

    _classCallCheck(this, FallbackBlockType);

    _get(Object.getPrototypeOf(FallbackBlockType.prototype), 'constructor', this).call(this, {
      type: 'unsupported',

      component: {

        render: function render() {
          return _react2['default'].createElement(
            'section',
            { className: 'col-unsupported' },
            _react2['default'].createElement(
              'header',
              { className: 'col-unsupported-header' },
              _react2['default'].createElement(
                'p',
                { className: 'col-unsupported-subtitle' },
                'Error'
              ),
              _react2['default'].createElement(
                'p',
                { className: 'col-unsupported-title' },
                'Unrecognized block “',
                block.type,
                '”'
              )
            ),
            _react2['default'].createElement(
              'div',
              { className: 'col-unsupported-content' },
              _react2['default'].createElement(
                'p',
                null,
                'This typically happens when a block type is removed, or the identifier changes.'
              ),
              _react2['default'].createElement(
                'p',
                null,
                _react2['default'].createElement(
                  'b',
                  { className: 'col-strong' },
                  'Your content has not been lost!'
                ),
                ' Feel free to ignore this message, or build a new block with the information below:'
              )
            ),
            _react2['default'].createElement(
              'pre',
              { className: 'col-unsupported-data' },
              JSON.stringify(block.content, null, 4)
            )
          );
        }

      }
    });
  }

  return FallbackBlockType;
})(_BlockType3['default']);

exports['default'] = FallbackBlockType;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2RlbHMvRmFsbGJhY2tCbG9ja1R5cGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQUlzQixhQUFhOzs7O3FCQUNiLE9BQU87Ozs7SUFFUixpQkFBaUI7WUFBakIsaUJBQWlCOztBQUV6QixXQUZRLGlCQUFpQixDQUV4QixJQUFTLEVBQUU7UUFBVCxLQUFLLEdBQVAsSUFBUyxDQUFQLEtBQUs7OzBCQUZBLGlCQUFpQjs7QUFHbEMsK0JBSGlCLGlCQUFpQiw2Q0FHNUI7QUFDSixVQUFJLEVBQUUsYUFBYTs7QUFFbkIsZUFBUyxFQUFFOztBQUVULGNBQU0sRUFBQSxrQkFBRztBQUNQLGlCQUNFOztjQUFTLFNBQVMsRUFBQyxpQkFBaUI7WUFDbEM7O2dCQUFRLFNBQVMsRUFBQyx3QkFBd0I7Y0FDeEM7O2tCQUFHLFNBQVMsRUFBQywwQkFBMEI7O2VBRW5DO2NBRUo7O2tCQUFHLFNBQVMsRUFBQyx1QkFBdUI7O2dCQUNOLEtBQUssQ0FBQyxJQUFJOztlQUNwQzthQUNHO1lBRVQ7O2dCQUFLLFNBQVMsRUFBQyx5QkFBeUI7Y0FDdEM7Ozs7ZUFHSTtjQUNKOzs7Z0JBQ0U7O29CQUFHLFNBQVMsRUFBQyxZQUFZOztpQkFBb0M7O2VBRTNEO2FBQ0E7WUFFTjs7Z0JBQUssU0FBUyxFQUFDLHNCQUFzQjtjQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUNwQztXQUNFLENBQ1g7U0FDRjs7T0FFRjtLQUNGLEVBQUM7R0FDSDs7U0F6Q2tCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoiRmFsbGJhY2tCbG9ja1R5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEEgZmFsbGJhY2sgYmxvY2sgdHlwZVxuICovXG5cbmltcG9ydCBCbG9ja1R5cGUgZnJvbSAnLi9CbG9ja1R5cGUnXG5pbXBvcnQgUmVhY3QgICAgIGZyb20gJ3JlYWN0J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYWxsYmFja0Jsb2NrVHlwZSBleHRlbmRzIEJsb2NrVHlwZSB7XG5cbiAgY29uc3RydWN0b3IoeyBibG9jayB9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgdHlwZTogJ3Vuc3VwcG9ydGVkJyxcblxuICAgICAgY29tcG9uZW50OiB7XG5cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJjb2wtdW5zdXBwb3J0ZWRcIj5cbiAgICAgICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJjb2wtdW5zdXBwb3J0ZWQtaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY29sLXVuc3VwcG9ydGVkLXN1YnRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICBFcnJvclxuICAgICAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImNvbC11bnN1cHBvcnRlZC10aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgVW5yZWNvZ25pemVkIGJsb2NrICZsZHF1bzt7IGJsb2NrLnR5cGUgfSZyZHF1bztcbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvaGVhZGVyPlxuXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLXVuc3VwcG9ydGVkLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICA8cD5cbiAgICAgICAgICAgICAgICAgIFRoaXMgdHlwaWNhbGx5IGhhcHBlbnMgd2hlbiBhIGJsb2NrIHR5cGUgaXMgcmVtb3ZlZCwgb3IgdGhlIGlkZW50aWZpZXJcbiAgICAgICAgICAgICAgICAgIGNoYW5nZXMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxwPlxuICAgICAgICAgICAgICAgICAgPGIgY2xhc3NOYW1lPVwiY29sLXN0cm9uZ1wiPllvdXIgY29udGVudCBoYXMgbm90IGJlZW4gbG9zdCE8L2I+IEZlZWwgZnJlZSB0byBpZ25vcmVcbiAgICAgICAgICAgICAgICAgIHRoaXMgbWVzc2FnZSwgb3IgYnVpbGQgYSBuZXcgYmxvY2sgd2l0aCB0aGUgaW5mb3JtYXRpb24gYmVsb3c6XG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8cHJlIGNsYXNzTmFtZT1cImNvbC11bnN1cHBvcnRlZC1kYXRhXCI+XG4gICAgICAgICAgICAgICAgeyBKU09OLnN0cmluZ2lmeShibG9jay5jb250ZW50LCBudWxsLCA0KSB9XG4gICAgICAgICAgICAgIDwvcHJlPlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19