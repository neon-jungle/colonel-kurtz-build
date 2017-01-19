"use strict";

module.exports = function blocksToJson(items) {
  // If items are null or undefined, assume an empty list
  items = items || [];

  var root = items.filter(function (i) {
    return !i.parent;
  });

  function jsonify(block) {
    var children = items.filter(function (i) {
      return i.parent === block;
    });

    return {
      content: block.content,
      type: block.type,
      blocks: children.map(jsonify)
    };
  }

  return root.map(jsonify);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9ibG9ja3NUb0pzb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsWUFBWSxDQUFFLEtBQUssRUFBRTs7QUFFN0MsT0FBSyxHQUFHLEtBQUssSUFBSSxFQUFFLENBQUE7O0FBRW5CLE1BQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO1dBQUksQ0FBQyxDQUFDLENBQUMsTUFBTTtHQUFBLENBQUMsQ0FBQTs7QUFFdkMsV0FBUyxPQUFPLENBQUUsS0FBSyxFQUFFO0FBQ3ZCLFFBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksQ0FBQyxDQUFDLE1BQU0sS0FBSyxLQUFLO0tBQUEsQ0FBQyxDQUFBOztBQUVwRCxXQUFPO0FBQ0wsYUFBTyxFQUFHLEtBQUssQ0FBQyxPQUFPO0FBQ3ZCLFVBQUksRUFBTSxLQUFLLENBQUMsSUFBSTtBQUNwQixZQUFNLEVBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7S0FDaEMsQ0FBQTtHQUNGOztBQUVELFNBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtDQUN6QixDQUFBIiwiZmlsZSI6ImJsb2Nrc1RvSnNvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmxvY2tzVG9Kc29uIChpdGVtcykge1xuICAvLyBJZiBpdGVtcyBhcmUgbnVsbCBvciB1bmRlZmluZWQsIGFzc3VtZSBhbiBlbXB0eSBsaXN0XG4gIGl0ZW1zID0gaXRlbXMgfHwgW11cblxuICBsZXQgcm9vdCA9IGl0ZW1zLmZpbHRlcihpID0+ICFpLnBhcmVudClcblxuICBmdW5jdGlvbiBqc29uaWZ5IChibG9jaykge1xuICAgIGxldCBjaGlsZHJlbiA9IGl0ZW1zLmZpbHRlcihpID0+IGkucGFyZW50ID09PSBibG9jaylcblxuICAgIHJldHVybiB7XG4gICAgICBjb250ZW50IDogYmxvY2suY29udGVudCxcbiAgICAgIHR5cGUgICAgOiBibG9jay50eXBlLFxuICAgICAgYmxvY2tzICA6IGNoaWxkcmVuLm1hcChqc29uaWZ5KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByb290Lm1hcChqc29uaWZ5KVxufVxuIl19