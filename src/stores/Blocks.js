/**
 * Block Store
 *
 * The Block Store is responsible for defining how blocks are stored
 * within Colonel Kurtz. Whenever an action associated with block
 * records is pushed into the system, this module tells Colonel Kurtz
 * how that action manipulates block data.
 */

'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Actions = require('../actions/blocks');
var Block = require('../models/Block');
var insertAt = require('../utils/insertAt');
var siblingAt = require('../utils/siblingAt');
var blocksToJson = require('../utils/blocksToJson');
var jsonToBlocks = require('../utils/jsonToBlocks');

var Blocks = {
  register: function register() {
    var _ref;

    return _ref = {}, _defineProperty(_ref, Actions.create, this.create), _defineProperty(_ref, Actions.destroy, this.destroy), _defineProperty(_ref, Actions.update, this.update), _defineProperty(_ref, Actions.move, this.move), _ref;
  },

  getInitialState: function getInitialState() {
    return [];
  },

  find: function find(state, id) {
    return state.filter(function (block) {
      return block.valueOf() === id;
    })[0];
  },

  getChildren: function getChildren(state, parent) {
    return state.filter(function (i) {
      return i.parent === parent;
    });
  },

  filterChildren: function filterChildren(state) {
    return state.filter(function (i) {
      return !i.parent;
    });
  },

  /**
   * `blocksToJson` takes a list of blocks and transforms them into
   * the nested structure shown in the front end
   */
  serialize: function serialize(state) {
    return blocksToJson(state);
  },

  /**
   * jsonToBlocks takes this nested structure and flattens
   * into a list for this store.
   */
  deserialize: function deserialize(state) {
    return jsonToBlocks(state);
  },

  create: function create(state, _ref2) {
    var type = _ref2.type;
    var parent = _ref2.parent;
    var position = _ref2.position;

    var record = new Block({ clientOnly: true, parent: parent, type: type });

    // If the provided position is a Block, place the new block right
    // after it.
    if (position instanceof Block) {
      position = state.indexOf(position) + 1;
    }

    return insertAt(state, record, position || 0);
  },

  update: function update(state, _ref3) {
    var id = _ref3.id;
    var content = _ref3.content;

    var block = Blocks.find(state, id);

    block.content = _extends(block.content, content);

    return state;
  },

  destroy: function destroy(state, id) {
    return state.filter(function (block) {
      for (var b = block; b; b = b.parent) {
        if (b.id == id) return false;
      }
      return true;
    });
  },

  move: function move(state, _ref4) {
    var block = _ref4.block;
    var distance = _ref4.distance;

    var without = state.filter(function (i) {
      return i !== block;
    });
    var before = siblingAt(state, block, distance);

    return insertAt(without, block, state.indexOf(before));
  }
};

module.exports = Blocks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zdG9yZXMvQmxvY2tzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQVNBLElBQUksT0FBTyxHQUFRLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQy9DLElBQUksS0FBSyxHQUFVLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQzdDLElBQUksUUFBUSxHQUFPLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQy9DLElBQUksU0FBUyxHQUFNLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO0FBQ2hELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ25ELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBOztBQUVuRCxJQUFJLE1BQU0sR0FBRztBQUNYLFVBQVEsRUFBQSxvQkFBRzs7O0FBQ1QsNENBQ0csT0FBTyxDQUFDLE1BQU0sRUFBSyxJQUFJLENBQUMsTUFBTSx5QkFDOUIsT0FBTyxDQUFDLE9BQU8sRUFBSSxJQUFJLENBQUMsT0FBTyx5QkFDL0IsT0FBTyxDQUFDLE1BQU0sRUFBSyxJQUFJLENBQUMsTUFBTSx5QkFDOUIsT0FBTyxDQUFDLElBQUksRUFBTyxJQUFJLENBQUMsSUFBSSxRQUM5QjtHQUNGOztBQUVELGlCQUFlLEVBQUEsMkJBQUc7QUFDaEIsV0FBTyxFQUFFLENBQUE7R0FDVjs7QUFFRCxNQUFJLEVBQUEsY0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO0FBQ2QsV0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSzthQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0tBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ3hEOztBQUVELGFBQVcsRUFBQSxxQkFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ3pCLFdBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7YUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLE1BQU07S0FBQSxDQUFDLENBQUE7R0FDOUM7O0FBRUQsZ0JBQWMsRUFBQSx3QkFBQyxLQUFLLEVBQUU7QUFDcEIsV0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU07S0FBQSxDQUFDLENBQUE7R0FDcEM7Ozs7OztBQU1ELFdBQVMsRUFBQSxtQkFBQyxLQUFLLEVBQUU7QUFDZixXQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUMzQjs7Ozs7O0FBTUQsYUFBVyxFQUFBLHFCQUFDLEtBQUssRUFBRTtBQUNqQixXQUFPLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtHQUMzQjs7QUFFRCxRQUFNLEVBQUEsZ0JBQUMsS0FBSyxFQUFFLEtBQTBCLEVBQUU7UUFBMUIsSUFBSSxHQUFOLEtBQTBCLENBQXhCLElBQUk7UUFBRSxNQUFNLEdBQWQsS0FBMEIsQ0FBbEIsTUFBTTtRQUFFLFFBQVEsR0FBeEIsS0FBMEIsQ0FBVixRQUFROztBQUNwQyxRQUFJLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxJQUFJLEVBQUosSUFBSSxFQUFFLENBQUMsQ0FBQTs7OztBQUkxRCxRQUFJLFFBQVEsWUFBWSxLQUFLLEVBQUU7QUFDN0IsY0FBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3ZDOztBQUVELFdBQU8sUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxJQUFJLENBQUMsQ0FBQyxDQUFBO0dBQzlDOztBQUVELFFBQU0sRUFBQSxnQkFBQyxLQUFLLEVBQUUsS0FBZSxFQUFFO1FBQWYsRUFBRSxHQUFKLEtBQWUsQ0FBYixFQUFFO1FBQUUsT0FBTyxHQUFiLEtBQWUsQ0FBVCxPQUFPOztBQUN6QixRQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTs7QUFFbEMsU0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFjLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7O0FBRXJELFdBQU8sS0FBSyxDQUFBO0dBQ2I7O0FBRUQsU0FBTyxFQUFBLGlCQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7QUFDakIsV0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVMsS0FBSyxFQUFFO0FBQ2xDLFdBQUssSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRTtBQUNuQyxZQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFBO09BQzdCO0FBQ0QsYUFBTyxJQUFJLENBQUE7S0FDWixDQUFDLENBQUE7R0FDSDs7QUFFRCxNQUFJLEVBQUEsY0FBQyxLQUFLLEVBQUUsS0FBbUIsRUFBRTtRQUFuQixLQUFLLEdBQVAsS0FBbUIsQ0FBakIsS0FBSztRQUFFLFFBQVEsR0FBakIsS0FBbUIsQ0FBVixRQUFROztBQUMzQixRQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQzthQUFJLENBQUMsS0FBSyxLQUFLO0tBQUEsQ0FBQyxDQUFBO0FBQzVDLFFBQUksTUFBTSxHQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFBOztBQUUvQyxXQUFPLFFBQVEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtHQUN2RDtDQUNGLENBQUE7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUEiLCJmaWxlIjoiQmxvY2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCbG9jayBTdG9yZVxuICpcbiAqIFRoZSBCbG9jayBTdG9yZSBpcyByZXNwb25zaWJsZSBmb3IgZGVmaW5pbmcgaG93IGJsb2NrcyBhcmUgc3RvcmVkXG4gKiB3aXRoaW4gQ29sb25lbCBLdXJ0ei4gV2hlbmV2ZXIgYW4gYWN0aW9uIGFzc29jaWF0ZWQgd2l0aCBibG9ja1xuICogcmVjb3JkcyBpcyBwdXNoZWQgaW50byB0aGUgc3lzdGVtLCB0aGlzIG1vZHVsZSB0ZWxscyBDb2xvbmVsIEt1cnR6XG4gKiBob3cgdGhhdCBhY3Rpb24gbWFuaXB1bGF0ZXMgYmxvY2sgZGF0YS5cbiAqL1xuXG5sZXQgQWN0aW9ucyAgICAgID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9ibG9ja3MnKVxubGV0IEJsb2NrICAgICAgICA9IHJlcXVpcmUoJy4uL21vZGVscy9CbG9jaycpXG5sZXQgaW5zZXJ0QXQgICAgID0gcmVxdWlyZSgnLi4vdXRpbHMvaW5zZXJ0QXQnKVxubGV0IHNpYmxpbmdBdCAgICA9IHJlcXVpcmUoJy4uL3V0aWxzL3NpYmxpbmdBdCcpXG5sZXQgYmxvY2tzVG9Kc29uID0gcmVxdWlyZSgnLi4vdXRpbHMvYmxvY2tzVG9Kc29uJylcbmxldCBqc29uVG9CbG9ja3MgPSByZXF1aXJlKCcuLi91dGlscy9qc29uVG9CbG9ja3MnKVxuXG5sZXQgQmxvY2tzID0ge1xuICByZWdpc3RlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW0FjdGlvbnMuY3JlYXRlXSAgOiB0aGlzLmNyZWF0ZSxcbiAgICAgIFtBY3Rpb25zLmRlc3Ryb3ldIDogdGhpcy5kZXN0cm95LFxuICAgICAgW0FjdGlvbnMudXBkYXRlXSAgOiB0aGlzLnVwZGF0ZSxcbiAgICAgIFtBY3Rpb25zLm1vdmVdICAgIDogdGhpcy5tb3ZlXG4gICAgfVxuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4gW11cbiAgfSxcblxuICBmaW5kKHN0YXRlLCBpZCkge1xuICAgIHJldHVybiBzdGF0ZS5maWx0ZXIoYmxvY2sgPT4gYmxvY2sudmFsdWVPZigpID09PSBpZClbMF1cbiAgfSxcblxuICBnZXRDaGlsZHJlbihzdGF0ZSwgcGFyZW50KSB7XG4gICAgcmV0dXJuIHN0YXRlLmZpbHRlcihpID0+IGkucGFyZW50ID09PSBwYXJlbnQpXG4gIH0sXG5cbiAgZmlsdGVyQ2hpbGRyZW4oc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGUuZmlsdGVyKGkgPT4gIWkucGFyZW50KVxuICB9LFxuXG4gIC8qKlxuICAgKiBgYmxvY2tzVG9Kc29uYCB0YWtlcyBhIGxpc3Qgb2YgYmxvY2tzIGFuZCB0cmFuc2Zvcm1zIHRoZW0gaW50b1xuICAgKiB0aGUgbmVzdGVkIHN0cnVjdHVyZSBzaG93biBpbiB0aGUgZnJvbnQgZW5kXG4gICAqL1xuICBzZXJpYWxpemUoc3RhdGUpIHtcbiAgICByZXR1cm4gYmxvY2tzVG9Kc29uKHN0YXRlKVxuICB9LFxuXG4gIC8qKlxuICAgKiBqc29uVG9CbG9ja3MgdGFrZXMgdGhpcyBuZXN0ZWQgc3RydWN0dXJlIGFuZCBmbGF0dGVuc1xuICAgKiBpbnRvIGEgbGlzdCBmb3IgdGhpcyBzdG9yZS5cbiAgICovXG4gIGRlc2VyaWFsaXplKHN0YXRlKSB7XG4gICAgcmV0dXJuIGpzb25Ub0Jsb2NrcyhzdGF0ZSlcbiAgfSxcblxuICBjcmVhdGUoc3RhdGUsIHsgdHlwZSwgcGFyZW50LCBwb3NpdGlvbiB9KSB7XG4gICAgbGV0IHJlY29yZCA9IG5ldyBCbG9jayh7IGNsaWVudE9ubHk6IHRydWUsIHBhcmVudCwgdHlwZSB9KVxuXG4gICAgLy8gSWYgdGhlIHByb3ZpZGVkIHBvc2l0aW9uIGlzIGEgQmxvY2ssIHBsYWNlIHRoZSBuZXcgYmxvY2sgcmlnaHRcbiAgICAvLyBhZnRlciBpdC5cbiAgICBpZiAocG9zaXRpb24gaW5zdGFuY2VvZiBCbG9jaykge1xuICAgICAgcG9zaXRpb24gPSBzdGF0ZS5pbmRleE9mKHBvc2l0aW9uKSArIDFcbiAgICB9XG5cbiAgICByZXR1cm4gaW5zZXJ0QXQoc3RhdGUsIHJlY29yZCwgcG9zaXRpb24gfHwgMClcbiAgfSxcblxuICB1cGRhdGUoc3RhdGUsIHsgaWQsIGNvbnRlbnQgfSkge1xuICAgIHZhciBibG9jayA9IEJsb2Nrcy5maW5kKHN0YXRlLCBpZClcblxuICAgIGJsb2NrLmNvbnRlbnQgPSBPYmplY3QuYXNzaWduKGJsb2NrLmNvbnRlbnQsIGNvbnRlbnQpXG5cbiAgICByZXR1cm4gc3RhdGVcbiAgfSxcblxuICBkZXN0cm95KHN0YXRlLCBpZCkge1xuICAgIHJldHVybiBzdGF0ZS5maWx0ZXIoZnVuY3Rpb24oYmxvY2spIHtcbiAgICAgIGZvciAobGV0IGIgPSBibG9jazsgYjsgYiA9IGIucGFyZW50KSB7XG4gICAgICAgIGlmIChiLmlkID09IGlkKSByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfSlcbiAgfSxcblxuICBtb3ZlKHN0YXRlLCB7IGJsb2NrLCBkaXN0YW5jZSB9KSB7XG4gICAgbGV0IHdpdGhvdXQgPSBzdGF0ZS5maWx0ZXIoaSA9PiBpICE9PSBibG9jaylcbiAgICBsZXQgYmVmb3JlICA9IHNpYmxpbmdBdChzdGF0ZSwgYmxvY2ssIGRpc3RhbmNlKVxuXG4gICAgcmV0dXJuIGluc2VydEF0KHdpdGhvdXQsIGJsb2NrLCBzdGF0ZS5pbmRleE9mKGJlZm9yZSkpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCbG9ja3NcbiJdfQ==