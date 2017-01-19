/**
 * Field
 * A reuseable field element
 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react');
var uid = require('uid');

var Field = React.createClass({
  displayName: 'Field',

  getDefaultProps: function getDefaultProps() {
    return {
      hint: null,
      element: 'input',
      type: 'text'
    };
  },

  getInitialState: function getInitialState() {
    return {
      hintId: 'hint-col-field-' + uid()
    };
  },

  getHint: function getHint(hint) {
    return hint ? React.createElement(
      'span',
      { id: this.state.hintId, className: 'col-field-hint' },
      hint
    ) : null;
  },

  render: function render() {
    var _props = this.props;
    var hint = _props.hint;
    var Element = _props.element;
    var label = _props.label;

    var props = _objectWithoutProperties(_props, ['hint', 'element', 'label']);

    var hintId = this.state.hintId;

    return React.createElement(
      'label',
      { className: 'col-field' },
      React.createElement(
        'span',
        { className: 'col-field-label' },
        label
      ),
      React.createElement(Element, _extends({ ref: 'input', className: 'col-field-input', 'aria-describedby': hint ? hintId : null }, props)),
      this.getHint(hint)
    );
  }

});

module.exports = Field;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9jb21tb24vZmllbGQuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBS0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzVCLElBQUksR0FBRyxHQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTs7QUFFMUIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRTVCLGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLFVBQUksRUFBTSxJQUFJO0FBQ2QsYUFBTyxFQUFHLE9BQU87QUFDakIsVUFBSSxFQUFNLE1BQU07S0FDakIsQ0FBQTtHQUNGOztBQUVELGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLFlBQU0sc0JBQW9CLEdBQUcsRUFBRSxBQUFFO0tBQ2xDLENBQUE7R0FDRjs7QUFFRCxTQUFPLEVBQUEsaUJBQUMsSUFBSSxFQUFFO0FBQ1osV0FBTyxJQUFJLEdBQUk7O1FBQU0sRUFBRSxFQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxBQUFFLEVBQUMsU0FBUyxFQUFDLGdCQUFnQjtNQUFHLElBQUk7S0FBUyxHQUFJLElBQUksQ0FBQTtHQUNqRzs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7aUJBQzBDLElBQUksQ0FBQyxLQUFLO1FBQXJELElBQUksVUFBSixJQUFJO1FBQVUsT0FBTyxVQUFmLE9BQU87UUFBVSxLQUFLLFVBQUwsS0FBSzs7UUFBSyxLQUFLOztRQUN0QyxNQUFNLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBckIsTUFBTTs7QUFFWixXQUNFOztRQUFPLFNBQVMsRUFBQyxXQUFXO01BQzFCOztVQUFNLFNBQVMsRUFBQyxpQkFBaUI7UUFBRyxLQUFLO09BQVM7TUFFbEQsb0JBQUMsT0FBTyxhQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsU0FBUyxFQUFDLGlCQUFpQixFQUFDLG9CQUFtQixJQUFJLEdBQUcsTUFBTSxHQUFHLElBQUksQUFBRSxJQUFNLEtBQUssRUFBSztNQUN4RyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztLQUNkLENBQ1Q7R0FDRjs7Q0FFRixDQUFDLENBQUE7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUEiLCJmaWxlIjoiZmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZpZWxkXG4gKiBBIHJldXNlYWJsZSBmaWVsZCBlbGVtZW50XG4gKi9cblxubGV0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKVxubGV0IHVpZCAgID0gcmVxdWlyZSgndWlkJylcblxubGV0IEZpZWxkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGludCAgICA6IG51bGwsXG4gICAgICBlbGVtZW50IDogJ2lucHV0JyxcbiAgICAgIHR5cGUgICAgOiAndGV4dCdcbiAgICB9XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoaW50SWQ6IGBoaW50LWNvbC1maWVsZC0ke3VpZCgpfWBcbiAgICB9XG4gIH0sXG5cbiAgZ2V0SGludChoaW50KSB7XG4gICAgcmV0dXJuIGhpbnQgPyAoPHNwYW4gaWQ9eyB0aGlzLnN0YXRlLmhpbnRJZCB9IGNsYXNzTmFtZT1cImNvbC1maWVsZC1oaW50XCI+eyBoaW50IH08L3NwYW4+KSA6IG51bGxcbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHsgaGludCwgZWxlbWVudDpFbGVtZW50LCBsYWJlbCwgLi4ucHJvcHMgfSA9IHRoaXMucHJvcHNcbiAgICBsZXQgeyBoaW50SWQgfSA9IHRoaXMuc3RhdGVcblxuICAgIHJldHVybiAoXG4gICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiY29sLWZpZWxkXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNvbC1maWVsZC1sYWJlbFwiPnsgbGFiZWwgfTwvc3Bhbj5cblxuICAgICAgICA8RWxlbWVudCByZWY9XCJpbnB1dFwiIGNsYXNzTmFtZT1cImNvbC1maWVsZC1pbnB1dFwiIGFyaWEtZGVzY3JpYmVkYnk9eyBoaW50ID8gaGludElkIDogbnVsbCB9IHsgLi4ucHJvcHMgfSAvPlxuICAgICAgICB7IHRoaXMuZ2V0SGludChoaW50KSB9XG4gICAgICA8L2xhYmVsPlxuICAgIClcbiAgfVxuXG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpZWxkXG4iXX0=