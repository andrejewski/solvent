
function Node(type) {
  return function _Node(left, right, attrs) {
    return Object.assign(attrs || {}, {
      type: type,
      left: left,
      right: right,
    });
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var types = [
  'number',
  'variable',
  'function',
  'negation',
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'exponentiation',
  'modulo',
  'assignment',
];

var ast = types.reduce(function(obj, type) {
  obj[capitalize(type)] = Node(type);
  return obj;
}, {});

module.exports = ast;

