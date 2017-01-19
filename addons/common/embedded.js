/**
 * Embedded
 * A reuseable embedded content element. For usage, see the YouTube addon.
 */

'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Field = require('./field');
var Frame = require('./frame');
var Graphic = require('./graphic');
var React = require('react');

var Embedded = React.createClass({
  displayName: 'Embedded',

  propTypes: {
    baseUrl: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    name: React.PropTypes.string.isRequired,
    resolveUrl: React.PropTypes.func,
    title: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      baseUrl: '',
      slug: '',
      title: 'Embedded Content',
      resolveUrl: function resolveUrl(base, slug) {
        return base + slug;
      }
    };
  },

  getSrc: function getSrc() {
    var _props = this.props;
    var baseUrl = _props.baseUrl;
    var resolveUrl = _props.resolveUrl;
    var slug = _props.slug;

    return this.hasSlug() ? resolveUrl(baseUrl, slug) : null;
  },

  hasSlug: function hasSlug() {
    var slug = this.props.slug;

    return ('' + (slug == undefined ? '' : slug)).trim().length > 0;
  },

  render: function render() {
    var _props2 = this.props;
    var className = _props2.className;
    var hint = _props2.hint;
    var name = _props2.name;
    var slug = _props2.slug;
    var title = _props2.title;

    return React.createElement(
      'div',
      { className: className },
      React.createElement(Field, { ref: 'field', hint: hint, label: title, value: slug, name: name, onChange: this._onChange }),
      this.props.children,
      React.createElement(
        Frame,
        { ref: 'frame', open: this.hasSlug() },
        React.createElement(Graphic, { key: slug, element: 'iframe', src: this.getSrc(slug) })
      )
    );
  },

  _onChange: function _onChange(e) {
    this.props.onChange(_defineProperty({}, this.props.name, e.currentTarget.value));
  }

});

module.exports = Embedded;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy9jb21tb24vZW1iZWRkZWQuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUNoQyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDaEMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3BDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFOUIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBRWpDLFdBQVMsRUFBRTtBQUNULFdBQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07QUFDL0IsWUFBUSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVU7QUFDekMsUUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVU7QUFDdkMsY0FBVSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSTtBQUNoQyxTQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO0dBQzlCOztBQUVELGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTztBQUNMLGFBQU8sRUFBRSxFQUFFO0FBQ1gsVUFBSSxFQUFFLEVBQUU7QUFDUixXQUFLLEVBQUUsa0JBQWtCO0FBQ3pCLGdCQUFVLEVBQUUsb0JBQUMsSUFBSSxFQUFFLElBQUk7ZUFBSyxJQUFJLEdBQUcsSUFBSTtPQUFBO0tBQ3hDLENBQUE7R0FDRjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7aUJBQytCLElBQUksQ0FBQyxLQUFLO1FBQXhDLE9BQU8sVUFBUCxPQUFPO1FBQUUsVUFBVSxVQUFWLFVBQVU7UUFBRSxJQUFJLFVBQUosSUFBSTs7QUFFakMsV0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUE7R0FDekQ7O0FBRUQsU0FBTyxFQUFBLG1CQUFHO1FBQ0EsSUFBSSxHQUFLLElBQUksQ0FBQyxLQUFLLENBQW5CLElBQUk7O0FBRVosV0FBTyxPQUFJLElBQUksSUFBSSxTQUFTLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQSxFQUFJLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7R0FDOUQ7O0FBRUQsUUFBTSxFQUFBLGtCQUFHO2tCQUN3QyxJQUFJLENBQUMsS0FBSztRQUFqRCxTQUFTLFdBQVQsU0FBUztRQUFFLElBQUksV0FBSixJQUFJO1FBQUUsSUFBSSxXQUFKLElBQUk7UUFBRSxJQUFJLFdBQUosSUFBSTtRQUFFLEtBQUssV0FBTCxLQUFLOztBQUUxQyxXQUNFOztRQUFLLFNBQVMsRUFBRyxTQUFTLEFBQUU7TUFDMUIsb0JBQUMsS0FBSyxJQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFHLElBQUksQUFBRSxFQUFDLEtBQUssRUFBRyxLQUFLLEFBQUUsRUFBQyxLQUFLLEVBQUcsSUFBSSxBQUFFLEVBQUMsSUFBSSxFQUFHLElBQUksQUFBRSxFQUFDLFFBQVEsRUFBRyxJQUFJLENBQUMsU0FBUyxBQUFFLEdBQUc7TUFDMUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO01BQ3JCO0FBQUMsYUFBSztVQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQUFBRTtRQUN4QyxvQkFBQyxPQUFPLElBQUMsR0FBRyxFQUFHLElBQUksQUFBRSxFQUFDLE9BQU8sRUFBQyxRQUFRLEVBQUMsR0FBRyxFQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEFBQUUsR0FBRztPQUM3RDtLQUNKLENBQ1A7R0FDRjs7QUFFRCxXQUFTLEVBQUEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsUUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLHFCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssRUFDeEMsQ0FBQTtHQUNIOztDQUVGLENBQUMsQ0FBQTs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQSIsImZpbGUiOiJlbWJlZGRlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRW1iZWRkZWRcbiAqIEEgcmV1c2VhYmxlIGVtYmVkZGVkIGNvbnRlbnQgZWxlbWVudC4gRm9yIHVzYWdlLCBzZWUgdGhlIFlvdVR1YmUgYWRkb24uXG4gKi9cblxuY29uc3QgRmllbGQgPSByZXF1aXJlKCcuL2ZpZWxkJylcbmNvbnN0IEZyYW1lID0gcmVxdWlyZSgnLi9mcmFtZScpXG5jb25zdCBHcmFwaGljID0gcmVxdWlyZSgnLi9ncmFwaGljJylcbmNvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKVxuXG5jb25zdCBFbWJlZGRlZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBwcm9wVHlwZXM6IHtcbiAgICBiYXNlVXJsOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIG9uQ2hhbmdlOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG5hbWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlVXJsOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICB0aXRsZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFzZVVybDogJycsXG4gICAgICBzbHVnOiAnJyxcbiAgICAgIHRpdGxlOiAnRW1iZWRkZWQgQ29udGVudCcsXG4gICAgICByZXNvbHZlVXJsOiAoYmFzZSwgc2x1ZykgPT4gYmFzZSArIHNsdWdcbiAgICB9XG4gIH0sXG5cbiAgZ2V0U3JjKCkge1xuICAgIGNvbnN0IHsgYmFzZVVybCwgcmVzb2x2ZVVybCwgc2x1ZyB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIHRoaXMuaGFzU2x1ZygpID8gcmVzb2x2ZVVybChiYXNlVXJsLCBzbHVnKSA6IG51bGxcbiAgfSxcblxuICBoYXNTbHVnKCkge1xuICAgIGNvbnN0IHsgc2x1ZyB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuIGAkeyBzbHVnID09IHVuZGVmaW5lZCA/ICcnIDogc2x1ZyB9YC50cmltKCkubGVuZ3RoID4gMFxuICB9LFxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNsYXNzTmFtZSwgaGludCwgbmFtZSwgc2x1ZywgdGl0bGUgfSA9IHRoaXMucHJvcHNcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9PlxuICAgICAgICA8RmllbGQgcmVmPVwiZmllbGRcIiBoaW50PXsgaGludCB9IGxhYmVsPXsgdGl0bGUgfSB2YWx1ZT17IHNsdWcgfSBuYW1lPXsgbmFtZSB9IG9uQ2hhbmdlPXsgdGhpcy5fb25DaGFuZ2UgfSAvPlxuICAgICAgICB7IHRoaXMucHJvcHMuY2hpbGRyZW4gfVxuICAgICAgICA8RnJhbWUgcmVmPVwiZnJhbWVcIiBvcGVuPXsgdGhpcy5oYXNTbHVnKCkgfT5cbiAgICAgICAgICA8R3JhcGhpYyBrZXk9eyBzbHVnIH0gZWxlbWVudD1cImlmcmFtZVwiIHNyYz17IHRoaXMuZ2V0U3JjKHNsdWcpIH0gLz5cbiAgICAgICAgPC9GcmFtZT5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcblxuICBfb25DaGFuZ2UoZSkge1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2Uoe1xuICAgICAgW3RoaXMucHJvcHMubmFtZV06IGUuY3VycmVudFRhcmdldC52YWx1ZVxuICAgIH0pXG4gIH1cblxufSlcblxubW9kdWxlLmV4cG9ydHMgPSBFbWJlZGRlZFxuIl19