/**
 * Youtube Colonel Kurtz Addon
 * This component adds a basic image block type, including a
 * src, caption, and credit
 */

'use strict';

var Embedded = require('../common/embedded');
var React = require('react');
var getYouTubeID = new RegExp('(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})', 'i');

function parseYouTube() {
  var value = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  var matches = value.match(getYouTubeID);
  return matches ? matches[1] : value;
}

var YouTube = React.createClass({
  displayName: 'YouTube',

  getDefaultProps: function getDefaultProps() {
    return {
      baseUrl: "https://www.youtube.com/embed/",
      content: {
        video_id: ''
      }
    };
  },

  render: function render() {
    var _props = this.props;
    var baseUrl = _props.baseUrl;
    var content = _props.content;

    return React.createElement(Embedded, { className: 'col-youtube',
      title: 'YouTube Video',
      hint: 'This can either be a video ID or URL. The video\'s unique ID will be saved.',
      baseUrl: baseUrl,
      name: 'video_id',
      slug: content.video_id,
      onChange: this._onChange });
  },

  _onChange: function _onChange(_ref) {
    var video_id = _ref.video_id;

    this.props.onChange({ video_id: parseYouTube(video_id) });
  }
});

module.exports = YouTube;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FkZG9ucy95b3V0dWJlL2luZGV4LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU1BLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQzlDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM5QixJQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxrR0FBa0csRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFeEksU0FBUyxZQUFZLEdBQVc7TUFBVixLQUFLLHlEQUFDLEVBQUU7O0FBQzVCLE1BQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDdkMsU0FBTyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQTtDQUNwQzs7QUFFRCxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFFaEMsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPO0FBQ0wsYUFBTyxFQUFFLGdDQUFnQztBQUN6QyxhQUFPLEVBQUU7QUFDUCxnQkFBUSxFQUFFLEVBQUU7T0FDYjtLQUNGLENBQUE7R0FDRjs7QUFFRCxRQUFNLEVBQUEsa0JBQUc7aUJBQ3NCLElBQUksQ0FBQyxLQUFLO1FBQS9CLE9BQU8sVUFBUCxPQUFPO1FBQUUsT0FBTyxVQUFQLE9BQU87O0FBRXhCLFdBQVEsb0JBQUMsUUFBUSxJQUFDLFNBQVMsRUFBQyxhQUFhO0FBQ3ZCLFdBQUssRUFBQyxlQUFlO0FBQ3JCLFVBQUksRUFBQyw2RUFBNEU7QUFDakYsYUFBTyxFQUFHLE9BQU8sQUFBRTtBQUNuQixVQUFJLEVBQUMsVUFBVTtBQUNmLFVBQUksRUFBRyxPQUFPLENBQUMsUUFBUSxBQUFFO0FBQ3pCLGNBQVEsRUFBRyxJQUFJLENBQUMsU0FBUyxBQUFFLEdBQUcsQ0FBQztHQUNsRDs7QUFFRCxXQUFTLEVBQUEsbUJBQUMsSUFBWSxFQUFFO1FBQVosUUFBUSxHQUFWLElBQVksQ0FBVixRQUFROztBQUNsQixRQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0dBQzFEO0NBQ0YsQ0FBQyxDQUFBOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBZb3V0dWJlIENvbG9uZWwgS3VydHogQWRkb25cbiAqIFRoaXMgY29tcG9uZW50IGFkZHMgYSBiYXNpYyBpbWFnZSBibG9jayB0eXBlLCBpbmNsdWRpbmcgYVxuICogc3JjLCBjYXB0aW9uLCBhbmQgY3JlZGl0XG4gKi9cblxuY29uc3QgRW1iZWRkZWQgPSByZXF1aXJlKCcuLi9jb21tb24vZW1iZWRkZWQnKVxuY29uc3QgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpXG5jb25zdCBnZXRZb3VUdWJlSUQgPSBuZXcgUmVnRXhwKCcoPzp5b3V0dWJlKD86LW5vY29va2llKT9cXC5jb20vKD86W14vXSsvLisvfCg/OnZ8ZSg/Om1iZWQpPykvfC4qWz8mXXY9KXx5b3V0dVxcLmJlLykoW15cIiY/LyBdezExfSknLCAnaScpXG5cbmZ1bmN0aW9uIHBhcnNlWW91VHViZSh2YWx1ZT0nJykge1xuICBsZXQgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKGdldFlvdVR1YmVJRClcbiAgcmV0dXJuIG1hdGNoZXMgPyBtYXRjaGVzWzFdIDogdmFsdWVcbn1cblxuY29uc3QgWW91VHViZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhc2VVcmw6IFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvXCIsXG4gICAgICBjb250ZW50OiB7XG4gICAgICAgIHZpZGVvX2lkOiAnJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBiYXNlVXJsLCBjb250ZW50IH0gPSB0aGlzLnByb3BzXG5cbiAgICByZXR1cm4gKDxFbWJlZGRlZCBjbGFzc05hbWU9XCJjb2wteW91dHViZVwiXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJZb3VUdWJlIFZpZGVvXCJcbiAgICAgICAgICAgICAgICAgICAgICBoaW50PVwiVGhpcyBjYW4gZWl0aGVyIGJlIGEgdmlkZW8gSUQgb3IgVVJMLiBUaGUgdmlkZW8ncyB1bmlxdWUgSUQgd2lsbCBiZSBzYXZlZC5cIlxuICAgICAgICAgICAgICAgICAgICAgIGJhc2VVcmw9eyBiYXNlVXJsIH1cbiAgICAgICAgICAgICAgICAgICAgICBuYW1lPVwidmlkZW9faWRcIlxuICAgICAgICAgICAgICAgICAgICAgIHNsdWc9eyBjb250ZW50LnZpZGVvX2lkIH1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMuX29uQ2hhbmdlIH0gLz4pXG4gIH0sXG5cbiAgX29uQ2hhbmdlKHsgdmlkZW9faWQgfSkge1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoeyB2aWRlb19pZDogcGFyc2VZb3VUdWJlKHZpZGVvX2lkKSB9KVxuICB9XG59KVxuXG5tb2R1bGUuZXhwb3J0cyA9IFlvdVR1YmVcbiJdfQ==