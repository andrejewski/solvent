
var unary = {
  number: function _number(ns) {return ns[0];},
  negation: function _negation(ns) {return -ns[0];},
  'function': function _function(ns) {
    if(typeof ns[0] !== 'function') {
      var msg = 'Function "'+ns[0]+'" is not a function.';
      throw new Error(msg);
    }
    return ns[0].apply(null, ns.slice(1));
  },
};

var varadic = {
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
  if(fn = unary[exp.type]) {
    return fn(compute(exp.nodes[0]));
  } if (fn = varadic[exp.type]) {
    return exp.nodes.map(compute).reduce(fn);
  } else {
    var msg = 'Node type "'+exp.type+'" not recognized for \n'+
              JSON.stringify(exp);
    throw new Error(msg);
  }
}

module.exports = compute;

