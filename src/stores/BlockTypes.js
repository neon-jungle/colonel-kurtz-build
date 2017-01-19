/**
 * Block Type Store
 *
 * A Block Type describes the editing experience for a Block. Whenever
 * an action associated with block type the system, this module tells
 * Colonel Kurtz how that action manipulates block type data.
 */

'use strict';

var BlockType = require('../models/BlockType');

module.exports = {
  getInitialState: function getInitialState() {
    return [];
  },

  deserialize: function deserialize() {
    var blockTypes = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

    return blockTypes.map(function (options) {
      return new BlockType(options);
    });
  },

  serialize: function serialize() {
    return undefined;
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdG9yZXMvQmxvY2tUeXBlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBUUEsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7O0FBRTlDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixpQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLFdBQU8sRUFBRSxDQUFBO0dBQ1Y7O0FBRUQsYUFBVyxFQUFBLHVCQUFnQjtRQUFmLFVBQVUseURBQUMsRUFBRTs7QUFDdkIsV0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTzthQUFJLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQztLQUFBLENBQUMsQ0FBQTtHQUN6RDs7QUFFRCxXQUFTLEVBQUEscUJBQUc7QUFDVixXQUFPLFNBQVMsQ0FBQTtHQUNqQjtDQUNGLENBQUEiLCJmaWxlIjoiQmxvY2tUeXBlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmxvY2sgVHlwZSBTdG9yZVxuICpcbiAqIEEgQmxvY2sgVHlwZSBkZXNjcmliZXMgdGhlIGVkaXRpbmcgZXhwZXJpZW5jZSBmb3IgYSBCbG9jay4gV2hlbmV2ZXJcbiAqIGFuIGFjdGlvbiBhc3NvY2lhdGVkIHdpdGggYmxvY2sgdHlwZSB0aGUgc3lzdGVtLCB0aGlzIG1vZHVsZSB0ZWxsc1xuICogQ29sb25lbCBLdXJ0eiBob3cgdGhhdCBhY3Rpb24gbWFuaXB1bGF0ZXMgYmxvY2sgdHlwZSBkYXRhLlxuICovXG5cbmxldCBCbG9ja1R5cGUgPSByZXF1aXJlKCcuLi9tb2RlbHMvQmxvY2tUeXBlJylcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4gW11cbiAgfSxcblxuICBkZXNlcmlhbGl6ZShibG9ja1R5cGVzPVtdKSB7XG4gICAgcmV0dXJuIGJsb2NrVHlwZXMubWFwKG9wdGlvbnMgPT4gbmV3IEJsb2NrVHlwZShvcHRpb25zKSlcbiAgfSxcblxuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG4iXX0=