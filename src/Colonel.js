/**
 * Colonel Kurts
 * A custom block editor
 */

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BlockTypes = require('./stores/BlockTypes');
var Blocks = require('./stores/Blocks');
var Microcosm = require('microcosm');
var bootstrap = require('./plugins/bootstrap');
var render = require('./plugins/render');

/**
 * Colonel Kurtz is a layer on top of the Microcosm framework
 * Microcosm is a simple Flux implementation designed to solve issues
 * with state specifically for Colonel Kurtz
 *
 * See:
 * https://github.com/vigetlabs/microcosm
 */

var ColonelKurtz = (function (_Microcosm) {
  _inherits(ColonelKurtz, _Microcosm);

  function ColonelKurtz(options) {
    _classCallCheck(this, ColonelKurtz);

    _get(Object.getPrototypeOf(ColonelKurtz.prototype), 'constructor', this).call(this);

    /**
     * A block is an individual chunk of content. It can have children
     */
    this.addStore('blocks', Blocks);

    /**
     * A block type defines the editing experience for a specific type
     * content
     */
    this.addStore('blockTypes', BlockTypes);

    /**
     * The bootstrap plugin takes seed data and prepares the
     * application's state beyond initializing
     */
    this.addPlugin(bootstrap, options);

    /**
     * The render plugin handles updating the browser ui
     */
    this.addPlugin(render, options);
  }

  _createClass(ColonelKurtz, [{
    key: 'toJSON',
    value: function toJSON() {
      return this.serialize().blocks;
    }
  }]);

  return ColonelKurtz;
})(Microcosm);

module.exports = ColonelKurtz;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Db2xvbmVsLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFLQSxJQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQTtBQUMvQyxJQUFJLE1BQU0sR0FBTyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUMzQyxJQUFJLFNBQVMsR0FBSSxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDckMsSUFBSSxTQUFTLEdBQUksT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDL0MsSUFBSSxNQUFNLEdBQU8sT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUE7Ozs7Ozs7Ozs7O0lBVXRDLFlBQVk7WUFBWixZQUFZOztBQUVMLFdBRlAsWUFBWSxDQUVKLE9BQU8sRUFBRTswQkFGakIsWUFBWTs7QUFHZCwrQkFIRSxZQUFZLDZDQUdQOzs7OztBQUtQLFFBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7Ozs7OztBQU12QyxRQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTs7Ozs7QUFLbEMsUUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDaEM7O2VBMUJHLFlBQVk7O1dBNEJWLGtCQUFHO0FBQ1AsYUFBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsTUFBTSxDQUFBO0tBQy9COzs7U0E5QkcsWUFBWTtHQUFTLFNBQVM7O0FBa0NwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQSIsImZpbGUiOiJDb2xvbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb2xvbmVsIEt1cnRzXG4gKiBBIGN1c3RvbSBibG9jayBlZGl0b3JcbiAqL1xuXG5sZXQgQmxvY2tUeXBlcyA9IHJlcXVpcmUoJy4vc3RvcmVzL0Jsb2NrVHlwZXMnKVxubGV0IEJsb2NrcyAgICAgPSByZXF1aXJlKCcuL3N0b3Jlcy9CbG9ja3MnKVxubGV0IE1pY3JvY29zbSAgPSByZXF1aXJlKCdtaWNyb2Nvc20nKVxubGV0IGJvb3RzdHJhcCAgPSByZXF1aXJlKCcuL3BsdWdpbnMvYm9vdHN0cmFwJylcbmxldCByZW5kZXIgICAgID0gcmVxdWlyZSgnLi9wbHVnaW5zL3JlbmRlcicpXG5cbi8qKlxuICogQ29sb25lbCBLdXJ0eiBpcyBhIGxheWVyIG9uIHRvcCBvZiB0aGUgTWljcm9jb3NtIGZyYW1ld29ya1xuICogTWljcm9jb3NtIGlzIGEgc2ltcGxlIEZsdXggaW1wbGVtZW50YXRpb24gZGVzaWduZWQgdG8gc29sdmUgaXNzdWVzXG4gKiB3aXRoIHN0YXRlIHNwZWNpZmljYWxseSBmb3IgQ29sb25lbCBLdXJ0elxuICpcbiAqIFNlZTpcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS92aWdldGxhYnMvbWljcm9jb3NtXG4gKi9cbmNsYXNzIENvbG9uZWxLdXJ0eiBleHRlbmRzIE1pY3JvY29zbSB7XG5cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKClcblxuICAgIC8qKlxuICAgICAqIEEgYmxvY2sgaXMgYW4gaW5kaXZpZHVhbCBjaHVuayBvZiBjb250ZW50LiBJdCBjYW4gaGF2ZSBjaGlsZHJlblxuICAgICAqL1xuICAgIHRoaXMuYWRkU3RvcmUoJ2Jsb2NrcycsIEJsb2NrcylcblxuICAgIC8qKlxuICAgICAqIEEgYmxvY2sgdHlwZSBkZWZpbmVzIHRoZSBlZGl0aW5nIGV4cGVyaWVuY2UgZm9yIGEgc3BlY2lmaWMgdHlwZVxuICAgICAqIGNvbnRlbnRcbiAgICAgKi9cbiAgICB0aGlzLmFkZFN0b3JlKCdibG9ja1R5cGVzJywgQmxvY2tUeXBlcylcblxuICAgIC8qKlxuICAgICAqIFRoZSBib290c3RyYXAgcGx1Z2luIHRha2VzIHNlZWQgZGF0YSBhbmQgcHJlcGFyZXMgdGhlXG4gICAgICogYXBwbGljYXRpb24ncyBzdGF0ZSBiZXlvbmQgaW5pdGlhbGl6aW5nXG4gICAgICovXG4gICAgdGhpcy5hZGRQbHVnaW4oYm9vdHN0cmFwLCBvcHRpb25zKVxuXG4gICAgLyoqXG4gICAgICogVGhlIHJlbmRlciBwbHVnaW4gaGFuZGxlcyB1cGRhdGluZyB0aGUgYnJvd3NlciB1aVxuICAgICAqL1xuICAgIHRoaXMuYWRkUGx1Z2luKHJlbmRlciwgb3B0aW9ucylcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gdGhpcy5zZXJpYWxpemUoKS5ibG9ja3NcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb25lbEt1cnR6XG4iXX0=