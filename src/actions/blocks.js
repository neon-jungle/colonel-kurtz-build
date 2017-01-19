"use strict";

module.exports = {
  create: function create(type, position, parent) {
    return { type: type, position: position, parent: parent };
  },

  destroy: function destroy(id) {
    return id;
  },

  update: function update(id, content) {
    // valueOf() allows blocks to be passed, it will return
    // the id
    return { id: id.valueOf(), content: content };
  },

  move: function move(block, distance) {
    return { block: block, distance: distance };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL2Jsb2Nrcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixRQUFNLEVBQUEsZ0JBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDN0IsV0FBTyxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUE7R0FDbEM7O0FBRUQsU0FBTyxFQUFBLGlCQUFDLEVBQUUsRUFBRTtBQUNWLFdBQU8sRUFBRSxDQUFBO0dBQ1Y7O0FBRUQsUUFBTSxFQUFBLGdCQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7OztBQUdsQixXQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLENBQUE7R0FDckM7O0FBRUQsTUFBSSxFQUFBLGNBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtBQUNwQixXQUFPLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUE7R0FDM0I7Q0FDRixDQUFBIiwiZmlsZSI6ImJsb2Nrcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGUodHlwZSwgcG9zaXRpb24sIHBhcmVudCkge1xuICAgIHJldHVybiB7IHR5cGUsIHBvc2l0aW9uLCBwYXJlbnQgfVxuICB9LFxuXG4gIGRlc3Ryb3koaWQpIHtcbiAgICByZXR1cm4gaWRcbiAgfSxcblxuICB1cGRhdGUoaWQsIGNvbnRlbnQpIHtcbiAgICAvLyB2YWx1ZU9mKCkgYWxsb3dzIGJsb2NrcyB0byBiZSBwYXNzZWQsIGl0IHdpbGwgcmV0dXJuXG4gICAgLy8gdGhlIGlkXG4gICAgcmV0dXJuIHsgaWQ6IGlkLnZhbHVlT2YoKSwgY29udGVudCB9XG4gIH0sXG5cbiAgbW92ZShibG9jaywgZGlzdGFuY2UpIHtcbiAgICByZXR1cm4geyBibG9jaywgZGlzdGFuY2UgfVxuICB9XG59XG4iXX0=