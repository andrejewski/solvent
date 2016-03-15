
function Node(type) {
  return function _Node(nodes, attrs) {
    if(!(Array.isArray(nodes) && nodes.length)) {
      var msg = 'Node "'+type+'" needs an array of at least one subnode.';
      throw new Error(msg);
    }
    return {
      type: type,
      nodes: nodes,
      attrs: attrs,
    };
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var types = [
  'assignment',
  'exponentiation',
  'multiplication',
  'division',
  'addition',
  'subtraction',
  'negation',
  'modulo',
  'function',
  'variable',
  'number',
];

var ast = types.reduce(function(obj, type) {
  obj[capitalize(type)] = Node(type);
  return obj;
}, {});

module.exports = ast;

