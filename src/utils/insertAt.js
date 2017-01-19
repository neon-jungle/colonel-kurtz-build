/**
 * InsertAfter
 * Given a list and an item, non-destructively return a new list
 * including the item after a given position
 */

"use strict";

var inRange = function inRange(value, min, max) {
  return Math.max(min, Math.min(max, value));
};

module.exports = function (list, item) {
  var position = arguments.length <= 2 || arguments[2] === undefined ? list.length : arguments[2];
  return (function () {
    var corrected = inRange(position, 0, list.length);

    var head = list.slice(0, corrected);
    var tail = list.slice(corrected);

    return head.concat(item, tail);
  })();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9pbnNlcnRBdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU1BLElBQUksT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRztTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0NBQUEsQ0FBQTs7QUFFdEUsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLElBQUksRUFBRSxJQUFJO01BQUUsUUFBUSx5REFBQyxJQUFJLENBQUMsTUFBTTtzQkFBRTtBQUMzRCxRQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7O0FBRWpELFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ25DLFFBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRWhDLFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7R0FDL0I7Q0FBQSxDQUFBIiwiZmlsZSI6Imluc2VydEF0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBJbnNlcnRBZnRlclxuICogR2l2ZW4gYSBsaXN0IGFuZCBhbiBpdGVtLCBub24tZGVzdHJ1Y3RpdmVseSByZXR1cm4gYSBuZXcgbGlzdFxuICogaW5jbHVkaW5nIHRoZSBpdGVtIGFmdGVyIGEgZ2l2ZW4gcG9zaXRpb25cbiAqL1xuXG5sZXQgaW5SYW5nZSA9ICh2YWx1ZSwgbWluLCBtYXgpID0+IE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2YWx1ZSkpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIGl0ZW0sIHBvc2l0aW9uPWxpc3QubGVuZ3RoKSB7XG4gIGxldCBjb3JyZWN0ZWQgPSBpblJhbmdlKHBvc2l0aW9uLCAwLCBsaXN0Lmxlbmd0aClcblxuICBsZXQgaGVhZCA9IGxpc3Quc2xpY2UoMCwgY29ycmVjdGVkKVxuICBsZXQgdGFpbCA9IGxpc3Quc2xpY2UoY29ycmVjdGVkKVxuXG4gIHJldHVybiBoZWFkLmNvbmNhdChpdGVtLCB0YWlsKVxufVxuIl19