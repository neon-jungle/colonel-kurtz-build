/**
 * Bootstrap
 * This plugin is responsible for injecting data into the system
 */

"use strict";

var parseElement = function parseElement(element) {
  var data = [];

  try {
    data = JSON.parse(element.value);
  } catch (x) {}

  return data;
};

module.exports = {

  filter: function filter(blockTypes, acceptable) {
    if (!acceptable) return blockTypes;

    return blockTypes.filter(function (type) {
      return acceptable.indexOf(type.id) > -1;
    });
  },

  register: function register(app, _ref, next) {
    var allow = _ref.allow;
    var _ref$maxChildren = _ref.maxChildren;
    var maxChildren = _ref$maxChildren === undefined ? Infinity : _ref$maxChildren;
    var blocks = _ref.blocks;
    var blockTypes = _ref.blockTypes;

    if (blocks instanceof HTMLElement) {
      blocks = parseElement(blocks);
    }

    app.replace({ maxChildren: maxChildren, blocks: blocks, blockTypes: this.filter(blockTypes, allow) }, next);
  }

};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wbHVnaW5zL2Jvb3RzdHJhcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0EsSUFBSSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQWEsT0FBTyxFQUFFO0FBQ3BDLE1BQUksSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFYixNQUFJO0FBQ0YsUUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0dBQ2pDLENBQUMsT0FBTSxDQUFDLEVBQUUsRUFBRTs7QUFFYixTQUFPLElBQUksQ0FBQTtDQUNaLENBQUE7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRzs7QUFFZixRQUFNLEVBQUEsZ0JBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRTtBQUM3QixRQUFJLENBQUMsVUFBVSxFQUFFLE9BQU8sVUFBVSxDQUFBOztBQUVsQyxXQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO2FBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0dBQ25FOztBQUVELFVBQVEsRUFBQSxrQkFBQyxHQUFHLEVBQUUsSUFBbUQsRUFBRSxJQUFJLEVBQUU7UUFBekQsS0FBSyxHQUFQLElBQW1ELENBQWpELEtBQUs7MkJBQVAsSUFBbUQsQ0FBMUMsV0FBVztRQUFYLFdBQVcsb0NBQUMsUUFBUTtRQUFFLE1BQU0sR0FBckMsSUFBbUQsQ0FBcEIsTUFBTTtRQUFFLFVBQVUsR0FBakQsSUFBbUQsQ0FBWixVQUFVOztBQUM3RCxRQUFJLE1BQU0sWUFBWSxXQUFXLEVBQUU7QUFDakMsWUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUM5Qjs7QUFFRCxPQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsV0FBVyxFQUFYLFdBQVcsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0dBQ3ZGOztDQUVGLENBQUEiLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCb290c3RyYXBcbiAqIFRoaXMgcGx1Z2luIGlzIHJlc3BvbnNpYmxlIGZvciBpbmplY3RpbmcgZGF0YSBpbnRvIHRoZSBzeXN0ZW1cbiAqL1xuXG5sZXQgcGFyc2VFbGVtZW50ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgbGV0IGRhdGEgPSBbXVxuXG4gIHRyeSB7XG4gICAgZGF0YSA9IEpTT04ucGFyc2UoZWxlbWVudC52YWx1ZSlcbiAgfSBjYXRjaCh4KSB7fVxuXG4gIHJldHVybiBkYXRhXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIGZpbHRlcihibG9ja1R5cGVzLCBhY2NlcHRhYmxlKSB7XG4gICAgaWYgKCFhY2NlcHRhYmxlKSByZXR1cm4gYmxvY2tUeXBlc1xuXG4gICAgcmV0dXJuIGJsb2NrVHlwZXMuZmlsdGVyKHR5cGUgPT4gYWNjZXB0YWJsZS5pbmRleE9mKHR5cGUuaWQpID4gLTEpXG4gIH0sXG5cbiAgcmVnaXN0ZXIoYXBwLCB7IGFsbG93LCBtYXhDaGlsZHJlbj1JbmZpbml0eSwgYmxvY2tzLCBibG9ja1R5cGVzIH0sIG5leHQpIHtcbiAgICBpZiAoYmxvY2tzIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIGJsb2NrcyA9IHBhcnNlRWxlbWVudChibG9ja3MpXG4gICAgfVxuXG4gICAgYXBwLnJlcGxhY2UoeyBtYXhDaGlsZHJlbiwgYmxvY2tzLCBibG9ja1R5cGVzOiB0aGlzLmZpbHRlcihibG9ja1R5cGVzLCBhbGxvdykgfSwgbmV4dClcbiAgfVxuXG59XG4iXX0=