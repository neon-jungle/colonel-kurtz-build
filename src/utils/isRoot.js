/**
 * isRoot
 * For displaying root level blocks, we only care about blocks that don't have
 * parents.
 */

"use strict";

module.exorts = function (lists) {
  return lists.filter(function (i) {
    return !i.parent;
  });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9pc1Jvb3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFNQSxNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsS0FBSyxFQUFFO0FBQy9CLFNBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7V0FBSSxDQUFDLENBQUMsQ0FBQyxNQUFNO0dBQUEsQ0FBQyxDQUFBO0NBQ3BDLENBQUEiLCJmaWxlIjoiaXNSb290LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBpc1Jvb3RcbiAqIEZvciBkaXNwbGF5aW5nIHJvb3QgbGV2ZWwgYmxvY2tzLCB3ZSBvbmx5IGNhcmUgYWJvdXQgYmxvY2tzIHRoYXQgZG9uJ3QgaGF2ZVxuICogcGFyZW50cy5cbiAqL1xuXG5tb2R1bGUuZXhvcnRzID0gZnVuY3Rpb24gKGxpc3RzKSB7XG4gIHJldHVybiBsaXN0cy5maWx0ZXIoaSA9PiAhaS5wYXJlbnQpXG59XG4iXX0=