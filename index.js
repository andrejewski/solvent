
function Node(type) {
  return function _Node(attrs) {
    return Object.assign(attrs, {type: type});
  }
}

var types = [
  'number',
  'variable',
  'function',
  'addition',
  'subtraction',
  'multiplication',
  'division',
  'modulo',
  'assignment',
];

var Nodes = types
  .map(function(type) {return Node(type);});

var ast = Nodes.reduce(function(obj, value, index) {
  obj[types[index]] = value;
  return obj;
}, {});

