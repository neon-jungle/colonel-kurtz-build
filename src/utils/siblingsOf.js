/**
 * siblingsOf
 * Get the siblings of a provided block
 */

"use strict";

module.exports = function siblingsOf(list, block) {
  if (block.parent) {
    return list.filter(function (i) {
      return i.parent === block.parent;
    });
  } else {
    return list.filter(function (i) {
      return !i.parent;
    });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9zaWJsaW5nc09mLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQSxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsVUFBVSxDQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDakQsTUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ2hCLFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssQ0FBQyxNQUFNO0tBQUEsQ0FBQyxDQUFBO0dBQ25ELE1BQU07QUFDTCxXQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLENBQUMsTUFBTTtLQUFBLENBQUMsQ0FBQTtHQUNuQztDQUNGLENBQUEiLCJmaWxlIjoic2libGluZ3NPZi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogc2libGluZ3NPZlxuICogR2V0IHRoZSBzaWJsaW5ncyBvZiBhIHByb3ZpZGVkIGJsb2NrXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaWJsaW5nc09mIChsaXN0LCBibG9jaykge1xuICBpZiAoYmxvY2sucGFyZW50KSB7XG4gICAgcmV0dXJuIGxpc3QuZmlsdGVyKGkgPT4gaS5wYXJlbnQgPT09IGJsb2NrLnBhcmVudClcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdC5maWx0ZXIoaSA9PiAhaS5wYXJlbnQpXG4gIH1cbn1cbiJdfQ==