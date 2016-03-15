
global.window = null;

var nearley = require('nearley');
var grammar = require('./math');

function parse(str) {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  var output = parser.feed(str).results;
  var ast = clean(output);
  console.log(JSON.stringify(ast, null, 2));
  return ast;
}

function clean(ast) {
  if(!(ast.length && ast[0].length)) return null;
  function _clean(ast) {
    while(Array.isArray(ast)) ast = ast[0];
    if(typeof ast !== 'object') return ast;
    ast.nodes = ast.nodes.map(_clean);
    return ast;
  }
  return _clean(ast);
}

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
  if(typeof exp === 'string') exp = parse(exp);
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

function reduceNodes(nodes, fn) {
  return nodes.map(computeValue).reduce(fn);
}

function argumentNodes(nodes, fn) {
  return fn.apply(null, nodes.map(computeValue));
}

function sum(x,y) {return x+y;}
function difference(x,y) {return x-y;}
function product(x,y) {return x*y;}
function quotient(x,y) {return x/y;}
function modulo(x,y) {return x%y;}
function raise(x,y) {return Math.pow(x, y);}

function computeValue(exp) {
  switch(exp.type) {
    case 'number':
      return exp.nodes[0];
    case 'assignment':
      return computeValue(exp.nodes.slice(-1));
    case 'negation':
      return -computeValue(exp.nodes[0]);
    case 'addition':
      return reduceNodes(exp.nodes, sum);
    case 'subtraction':
      return reduceNodes(exp.nodes, difference);
    case 'multiplication':
      return reduceNodes(exp.nodes, product);
    case 'division':
      return reduceNodes(exp.nodes, quotient);
    case 'modulo':
      return reduceNodes(exp.nodes, modulo);
    case 'exponentiation':
      return reduceNodes(exp.nodes, raise);
    case 'function':
      return argumentNodes(exp.nodes.slice(1), exp.nodes[0]);
    case 'variable':
      var msg = 'Node type "variable" must be resolved before it can be computed.';
      throw new Error(msg);
      break;
    default:
      var msg = 'Node type "'+exp.type+'" not recognized for \n'+
                JSON.stringify(exp);
      throw new Error(msg);
  }
}

function Context(expressions, constants) {
  return {
    expressions: expressions,
    constants: constants,
  };
}

function defaultContext() {
  return Context([], Math);
}

function populateUnknowns(expression, context) {
  return expression;
}

function evaluate(expression, context) {
  if(typeof expression === 'string') {
    expression = parse(expression);
  }
  if(!context) context = defaultContext();

  var expression = populateUnknowns(expression, context);
  return computeValue(expression);
}

module.exports = {
  parse: parse,
  evaluate: evaluate,
  solveFor: solveFor,
};

