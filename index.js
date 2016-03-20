
var parse = require('./parse');
var compute = require('./compute');

function symbolicSolveFor(left, right) {
  var result = {success: false}; 
  return result;
}

function findNode(tree, predicate) {
  var searchSet = [tree];
  var node;
  while(searchSet.length) {
    node = searchSet.shift();
    if(predicate(node)) return node;
    node.nodes.forEach(function(x) {
      if(typeof x === 'object') {
        searchSet.push(x);
      }
    });
  }
  return undefined;
}

function findNodes(tree, predicate) {
  var searchSet = [tree];
  var nodes = [];
  while(searchSet.length) {
    node = searchSet.shift();
    if(predicate(node)) nodes.push(node);
    node.nodes.forEach(function(x) {
      if(typeof x === 'object') {
        searchSet.push(x);
      }
    });
  }
  return nodes;
}

function solveFor(exp, variableName) {
  var equalities = findNode(exp, function(x) {
    return x.type === 'assignment';
  });
  if(!equalities.length) {
    var msg = "Equation not provided, unable to solve for \""+variableName+"\"."
    throw new Error(msg); 
  }

  var totalVarCount = 0;
  var eqs = equalities.map(function(eq) {
    var side = {};
    side.equality = eq;
    side.varNodes = findNodes(eq, function(x) {
      return x.type === 'variable' && x.nodes[0] === variableName;
    });
    side.varCount = side.varNodes.length;
    totalVarCount += side.varCount;
    return side;
  }).sort(function(a, b) {
    return b.varCount - a.varCount;
  });

  if(!totalVarCount) {
    var msg = "Variable \""+variableName+"\" not found in equation.";
    throw new Error(msg);
  }

  var leastVarIndex = 0;
  while(eqs[leastVarIndex].varCount === 0) leastVarIndex++;

  var impotentEqs = eqs.slice(0, leastVarIndex);
  var variableEqs = eqs.slice(leastVarIndex);
  
  var iLen = impotentEqs.length;
  var vLen = variableEqs.length;
  
  var attempts = 0;
  for(var v = 0; v < vLen; v++) {
    for(var i = 0; i < iLen; i++) {
      attempts++;
      variableEq = variableEqs[v];
      impotentEq = impotentEqs[i];
      var result = symbolicSolveFor(variableEq, impotentEqs);
      if(result.success) {
        return result.expression;
      }
    }
  }

  var msg = "After \""+attempts+"\" tries, the variable \""+variableName+"\" was not solved for.";
  throw new Error(msg);
}

function Context(expressions, constants) {
  return {
    expressions: expressions,
    constants: constants,
  };
}

function evaluate(expression, context) {
  context = context || Context([], Math);
  // populate variables and functions
  return expression;
}

module.exports = {
  parse: parse,
  evaluate: evaluate,
  Context: Context,
  compute: compute,
  solveFor: solveFor,
};

