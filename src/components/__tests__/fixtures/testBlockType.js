'use strict';

module.exports = {
  id: 'test',
  label: 'Test',
  component: {
    getDefaultProps: function getDefaultProps() {
      return {
        content: {
          text: 'Test'
        }
      };
    },
    getMenuItems: function getMenuItems() {
      return [{ id: 'test', label: 'Test' }];
    },
    render: function render() {
      return React.createElement(
        'div',
        null,
        this.props.children
      );
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL19fdGVzdHNfXy9maXh0dXJlcy90ZXN0QmxvY2tUeXBlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLElBQUUsRUFBTSxNQUFNO0FBQ2QsT0FBSyxFQUFHLE1BQU07QUFDZCxXQUFTLEVBQUU7QUFDVCxtQkFBZSxFQUFBLDJCQUFHO0FBQ2hCLGFBQU87QUFDTCxlQUFPLEVBQUU7QUFDUCxjQUFJLEVBQUUsTUFBTTtTQUNiO09BQ0YsQ0FBQTtLQUNGO0FBQ0QsZ0JBQVksRUFBQSx3QkFBRztBQUNiLGFBQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUE7S0FDdkM7QUFDRCxVQUFNLEVBQUEsa0JBQUc7QUFDUCxhQUFPOzs7UUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVE7T0FBUSxDQUFBO0tBQzFDO0dBQ0Y7Q0FDRixDQUFBIiwiZmlsZSI6InRlc3RCbG9ja1R5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgaWQgICAgOiAndGVzdCcsXG4gIGxhYmVsIDogJ1Rlc3QnLFxuICBjb21wb25lbnQ6IHtcbiAgICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb250ZW50OiB7XG4gICAgICAgICAgdGV4dDogJ1Rlc3QnXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGdldE1lbnVJdGVtcygpIHtcbiAgICAgIHJldHVybiBbeyBpZDogJ3Rlc3QnLCBsYWJlbDogJ1Rlc3QnIH1dXG4gICAgfSxcbiAgICByZW5kZXIoKSB7XG4gICAgICByZXR1cm4gPGRpdj57IHRoaXMucHJvcHMuY2hpbGRyZW4gfTwvZGl2PlxuICAgIH1cbiAgfVxufVxuIl19