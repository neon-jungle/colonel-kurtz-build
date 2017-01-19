/**
 * typesForBlock
 * Extracted logic to get the types of children a block may have
 */

"use strict";

module.exports = function (blockTypes, block) {
  if (block) {
    var _ret = (function () {
      var types = blockTypes.filter(function (i) {
        return i.id === block.type;
      })[0].types;
      return {
        v: blockTypes.filter(function (i) {
          return types.indexOf(i.id) > -1;
        })
      };
    })();

    if (typeof _ret === "object") return _ret.v;
  } else {
    return blockTypes.filter(function (type) {
      return type.root;
    });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy90eXBlc0ZvckJsb2NrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFLQSxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsVUFBVSxFQUFFLEtBQUssRUFBRTtBQUM1QyxNQUFJLEtBQUssRUFBRTs7QUFDVCxVQUFJLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLElBQUk7T0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO0FBQ2hFO1dBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7aUJBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQUEsQ0FBQztRQUFBOzs7O0dBQ3hELE1BQU07QUFDTCxXQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO2FBQUksSUFBSSxDQUFDLElBQUk7S0FBQSxDQUFDLENBQUE7R0FDNUM7Q0FDRixDQUFBIiwiZmlsZSI6InR5cGVzRm9yQmxvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIHR5cGVzRm9yQmxvY2tcbiAqIEV4dHJhY3RlZCBsb2dpYyB0byBnZXQgdGhlIHR5cGVzIG9mIGNoaWxkcmVuIGEgYmxvY2sgbWF5IGhhdmVcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChibG9ja1R5cGVzLCBibG9jaykge1xuICBpZiAoYmxvY2spIHtcbiAgICBsZXQgdHlwZXMgPSBibG9ja1R5cGVzLmZpbHRlcihpID0+IGkuaWQgPT09IGJsb2NrLnR5cGUpWzBdLnR5cGVzXG4gICAgcmV0dXJuIGJsb2NrVHlwZXMuZmlsdGVyKGkgPT4gdHlwZXMuaW5kZXhPZihpLmlkKSA+IC0xKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBibG9ja1R5cGVzLmZpbHRlcih0eXBlID0+IHR5cGUucm9vdClcbiAgfVxufVxuIl19