/**
 * HTML Embed
 * A reuseable element for embedding HTML and associated JS.
 */

'use strict';

var Field = require('../common/field');
var React = require('react');
var toArray = function toArray(list) {
  return Array.prototype.slice.call(list);
};

function sanitize(html) {
  var bucket = document.createElement('div');

  bucket.innerHTML = html;

  var doNotAllow = toArray(bucket.querySelectorAll('script, style'));

  doNotAllow.forEach(function (el) {
    return el.parentNode.removeChild(el);
  });

  return bucket.innerHTML;
}

module.exports = React.createClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      content: {
        html: '',
        script: ''
      }
    };
  },

  shouldDisplaySandbox: function shouldDisplaySandbox() {
    return this.props.content.html || this.props.content.script;
  },

  getSandbox: function getSandbox() {
    var _props$content = this.props.content;
    var _props$content$html = _props$content.html;
    var html = _props$content$html === undefined ? '' : _props$content$html;
    var _props$content$script = _props$content.script;
    var script = _props$content$script === undefined ? '' : _props$content$script;

    var encoding = "data:text/html;charset=utf-8,";
    var style = "<style>body { margin: 0 }</style>";
    var javascript = '<script src="' + script + '" async></script>';
    var embeddable = encoding + escape(style + html + javascript);

    return React.createElement('iframe', { className: 'col-block-html-frame', src: embeddable });
  },

  render: function render() {
    var _props$content2 = this.props.content;
    var html = _props$content2.html;
    var script = _props$content2.script;

    return React.createElement(
      'div',
      null,
      React.createElement(Field, { className: 'col-block-html',
        label: 'HTML Embed',
        element: 'textarea',
        hint: 'Paste HTML into this field. Include related JavaScript below.',
        ref: 'html',
        value: html,
        onChange: this.onHTMLChange }),
      React.createElement(Field, { label: 'Embedded JavaScript URL',
        hint: 'Paste the JavaScript URL of the embed into this field.',
        ref: 'script',
        value: script,
        onChange: this.onScriptChange }),
      this.shouldDisplaySandbox() ? this.getSandbox() : null
    );
  },

  onScriptChange: function onScriptChange(event) {
    this.props.onChange({ script: event.target.value });
  },

  onHTMLChange: function onHTMLChange(event) {
    this.props.onChange({ html: sanitize(event.target.value) });
  }

});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9odG1sLWVtYmVkL2luZGV4LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0EsSUFBTSxLQUFLLEdBQUssT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDMUMsSUFBTSxLQUFLLEdBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ2hDLElBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFHLElBQUk7U0FBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0NBQUEsQ0FBQTs7QUFFeEQsU0FBUyxRQUFRLENBQUUsSUFBSSxFQUFFO0FBQ3ZCLE1BQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRTFDLFFBQU0sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFBOztBQUV2QixNQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUE7O0FBRWxFLFlBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxFQUFFO1dBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDO0dBQUEsQ0FBQyxDQUFBOztBQUV2RCxTQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUE7Q0FDeEI7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFakMsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsYUFBTyxFQUFFO0FBQ1AsWUFBSSxFQUFJLEVBQUU7QUFDVixjQUFNLEVBQUUsRUFBRTtPQUNYO0tBQ0YsQ0FBQTtHQUNGOztBQUVELHNCQUFvQixFQUFBLGdDQUFHO0FBQ3JCLFdBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQTtHQUM1RDs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7eUJBQ3NCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTzs2Q0FBN0MsSUFBSTtRQUFKLElBQUksdUNBQUcsRUFBRTsrQ0FBRSxNQUFNO1FBQU4sTUFBTSx5Q0FBRyxFQUFFOztBQUU1QixRQUFJLFFBQVEsR0FBSywrQkFBK0IsQ0FBQTtBQUNoRCxRQUFJLEtBQUssR0FBUSxtQ0FBbUMsQ0FBQTtBQUNwRCxRQUFJLFVBQVUscUJBQW9CLE1BQU0sc0JBQW9CLENBQUE7QUFDNUQsUUFBSSxVQUFVLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFBOztBQUU3RCxXQUFPLGdDQUFRLFNBQVMsRUFBQyxzQkFBc0IsRUFBQyxHQUFHLEVBQUcsVUFBVSxBQUFFLEdBQUcsQ0FBQTtHQUN0RTs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7MEJBQ2dCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztRQUFuQyxJQUFJLG1CQUFKLElBQUk7UUFBRSxNQUFNLG1CQUFOLE1BQU07O0FBRWxCLFdBQ0U7OztNQUNFLG9CQUFDLEtBQUssSUFBQyxTQUFTLEVBQUMsZ0JBQWdCO0FBQzFCLGFBQUssRUFBQyxZQUFZO0FBQ2xCLGVBQU8sRUFBQyxVQUFVO0FBQ2xCLFlBQUksRUFBQywrREFBK0Q7QUFDcEUsV0FBRyxFQUFDLE1BQU07QUFDVixhQUFLLEVBQUcsSUFBSSxBQUFFO0FBQ2QsZ0JBQVEsRUFBRyxJQUFJLENBQUMsWUFBWSxBQUFFLEdBQUc7TUFFeEMsb0JBQUMsS0FBSyxJQUFDLEtBQUssRUFBQyx5QkFBeUI7QUFDL0IsWUFBSSxFQUFDLHdEQUF3RDtBQUM3RCxXQUFHLEVBQUMsUUFBUTtBQUNaLGFBQUssRUFBRyxNQUFNLEFBQUU7QUFDaEIsZ0JBQVEsRUFBRyxJQUFJLENBQUMsY0FBYyxBQUFFLEdBQUc7TUFFeEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLElBQUk7S0FDcEQsQ0FDUDtHQUNGOztBQUVELGdCQUFjLEVBQUEsd0JBQUMsS0FBSyxFQUFFO0FBQ3BCLFFBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtHQUNwRDs7QUFFRCxjQUFZLEVBQUEsc0JBQUMsS0FBSyxFQUFFO0FBQ2xCLFFBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtHQUM1RDs7Q0FFRixDQUFDLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhUTUwgRW1iZWRcbiAqIEEgcmV1c2VhYmxlIGVsZW1lbnQgZm9yIGVtYmVkZGluZyBIVE1MIGFuZCBhc3NvY2lhdGVkIEpTLlxuICovXG5cbmNvbnN0IEZpZWxkICAgPSByZXF1aXJlKCcuLi9jb21tb24vZmllbGQnKVxuY29uc3QgUmVhY3QgICA9IHJlcXVpcmUoJ3JlYWN0JylcbmNvbnN0IHRvQXJyYXkgPSBsaXN0ID0+IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QpXG5cbmZ1bmN0aW9uIHNhbml0aXplIChodG1sKSB7XG4gIGxldCBidWNrZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXG4gIGJ1Y2tldC5pbm5lckhUTUwgPSBodG1sXG5cbiAgbGV0IGRvTm90QWxsb3cgPSB0b0FycmF5KGJ1Y2tldC5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQsIHN0eWxlJykpXG5cbiAgZG9Ob3RBbGxvdy5mb3JFYWNoKGVsID0+IGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpKVxuXG4gIHJldHVybiBidWNrZXQuaW5uZXJIVE1MXG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29udGVudDoge1xuICAgICAgICBodG1sOiAgICcnLFxuICAgICAgICBzY3JpcHQ6ICcnXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHNob3VsZERpc3BsYXlTYW5kYm94KCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnRlbnQuaHRtbCB8fCB0aGlzLnByb3BzLmNvbnRlbnQuc2NyaXB0XG4gIH0sXG5cbiAgZ2V0U2FuZGJveCgpIHtcbiAgICBsZXQgeyBodG1sID0gJycsIHNjcmlwdCA9ICcnIH0gPSB0aGlzLnByb3BzLmNvbnRlbnRcblxuICAgIGxldCBlbmNvZGluZyAgID0gXCJkYXRhOnRleHQvaHRtbDtjaGFyc2V0PXV0Zi04LFwiXG4gICAgbGV0IHN0eWxlICAgICAgPSBcIjxzdHlsZT5ib2R5IHsgbWFyZ2luOiAwIH08L3N0eWxlPlwiXG4gICAgbGV0IGphdmFzY3JpcHQgPSBgPHNjcmlwdCBzcmM9XCIkeyBzY3JpcHQgfVwiIGFzeW5jPjwvc2NyaXB0PmBcbiAgICBsZXQgZW1iZWRkYWJsZSA9IGVuY29kaW5nICsgZXNjYXBlKHN0eWxlICsgaHRtbCArIGphdmFzY3JpcHQpXG5cbiAgICByZXR1cm4gPGlmcmFtZSBjbGFzc05hbWU9XCJjb2wtYmxvY2staHRtbC1mcmFtZVwiIHNyYz17IGVtYmVkZGFibGUgfSAvPlxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBodG1sLCBzY3JpcHQgfSA9IHRoaXMucHJvcHMuY29udGVudFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxGaWVsZCBjbGFzc05hbWU9XCJjb2wtYmxvY2staHRtbFwiXG4gICAgICAgICAgICAgICBsYWJlbD1cIkhUTUwgRW1iZWRcIlxuICAgICAgICAgICAgICAgZWxlbWVudD1cInRleHRhcmVhXCJcbiAgICAgICAgICAgICAgIGhpbnQ9XCJQYXN0ZSBIVE1MIGludG8gdGhpcyBmaWVsZC4gSW5jbHVkZSByZWxhdGVkIEphdmFTY3JpcHQgYmVsb3cuXCJcbiAgICAgICAgICAgICAgIHJlZj1cImh0bWxcIlxuICAgICAgICAgICAgICAgdmFsdWU9eyBodG1sIH1cbiAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsgdGhpcy5vbkhUTUxDaGFuZ2UgfSAvPlxuXG4gICAgICAgIDxGaWVsZCBsYWJlbD1cIkVtYmVkZGVkIEphdmFTY3JpcHQgVVJMXCJcbiAgICAgICAgICAgICAgIGhpbnQ9XCJQYXN0ZSB0aGUgSmF2YVNjcmlwdCBVUkwgb2YgdGhlIGVtYmVkIGludG8gdGhpcyBmaWVsZC5cIlxuICAgICAgICAgICAgICAgcmVmPVwic2NyaXB0XCJcbiAgICAgICAgICAgICAgIHZhbHVlPXsgc2NyaXB0IH1cbiAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsgdGhpcy5vblNjcmlwdENoYW5nZSB9IC8+XG5cbiAgICAgICAgeyB0aGlzLnNob3VsZERpc3BsYXlTYW5kYm94KCkgPyB0aGlzLmdldFNhbmRib3goKSA6IG51bGwgfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxuXG4gIG9uU2NyaXB0Q2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IHNjcmlwdDogZXZlbnQudGFyZ2V0LnZhbHVlIH0pXG4gIH0sXG5cbiAgb25IVE1MQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IGh0bWw6IHNhbml0aXplKGV2ZW50LnRhcmdldC52YWx1ZSkgfSlcbiAgfVxuXG59KVxuIl19