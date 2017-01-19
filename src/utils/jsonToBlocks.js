'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var Block = require('../models/Block');

module.exports = function jsonToBlocks(blocks, parent) {
  // If blocks are null or undefined, assume an empty list
  blocks = blocks || [];

  return blocks.reduce(function (memo, params) {
    var block = new Block(_extends({}, params, { parent: parent }));
    var children = jsonToBlocks(params.blocks, block);

    return memo.concat(block, children);
  }, []);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9qc29uVG9CbG9ja3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBOztBQUV0QyxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsWUFBWSxDQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7O0FBRXRELFFBQU0sR0FBRyxNQUFNLElBQUksRUFBRSxDQUFBOztBQUVyQixTQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQzNDLFFBQUksS0FBSyxHQUFNLElBQUksS0FBSyxjQUFNLE1BQU0sSUFBRSxNQUFNLEVBQU4sTUFBTSxJQUFHLENBQUE7QUFDL0MsUUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7O0FBRWpELFdBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUE7R0FDcEMsRUFBRSxFQUFFLENBQUMsQ0FBQTtDQUNQLENBQUEiLCJmaWxlIjoianNvblRvQmxvY2tzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IEJsb2NrID0gcmVxdWlyZSgnLi4vbW9kZWxzL0Jsb2NrJylcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBqc29uVG9CbG9ja3MgKGJsb2NrcywgcGFyZW50KSB7XG4gIC8vIElmIGJsb2NrcyBhcmUgbnVsbCBvciB1bmRlZmluZWQsIGFzc3VtZSBhbiBlbXB0eSBsaXN0XG4gIGJsb2NrcyA9IGJsb2NrcyB8fCBbXVxuXG4gIHJldHVybiBibG9ja3MucmVkdWNlKGZ1bmN0aW9uIChtZW1vLCBwYXJhbXMpIHtcbiAgICBsZXQgYmxvY2sgICAgPSBuZXcgQmxvY2soeyAuLi5wYXJhbXMsIHBhcmVudCB9KVxuICAgIGxldCBjaGlsZHJlbiA9IGpzb25Ub0Jsb2NrcyhwYXJhbXMuYmxvY2tzLCBibG9jaylcblxuICAgIHJldHVybiBtZW1vLmNvbmNhdChibG9jaywgY2hpbGRyZW4pXG4gIH0sIFtdKVxufVxuIl19