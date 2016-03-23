
var operations = {
  number: function _number(ns) {return ns;},
  negation: function _negation(ns) {return -ns;},
  'function': function _function(ns, val, idx, list) {
    if(idx > 1) return ns;
    if(typeof ns !== 'function') {
      var msg = 'Function "'+ns+'" is not a function.';
      throw new Error(msg);
    }
    return ns.apply(null, list.slice(1));
  },

  addition: function addition(x,y) {return x+y;},
  subtraction: function subtraction(x,y) {return x-y;},
  multiplication: function multiplication(x,y) {return x*y;},
  division: function division(x,y) {return x/y;},
  exponentiation: function exponentiation(x,y) {return Math.pow(x,y);},

  modulo: function modulo(x,y) {return x%y},
  assignment: function assignment(x, y) {return y;},
};

function compute(exp) {
  if(typeof exp === 'number') return exp;
  var fn;
  if (fn = operations[exp.type]) {
    if(exp.type === 'negation') exp.nodes.push(0); // exec hack
    return exp.nodes.map(compute).reduce(fn);
  } else {
    var msg = 'Node type "'+exp.type+'" not recognized for \n'+
              JSON.stringify(exp);
    throw new Error(msg);
  }
}

module.exports = compute;

