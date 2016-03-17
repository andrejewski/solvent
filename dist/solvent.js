(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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


},{}],2:[function(require,module,exports){

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


},{}],3:[function(require,module,exports){

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
  compute: compute,
  solveFor: solveFor,
};


},{"./compute":2,"./parse":6}],4:[function(require,module,exports){
// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 var ast = window ? window.ast : require('./ast.js'); var grammar = {
    ParserRules: [
    {"name": "main", "symbols": ["_", "EXP", "_"], "postprocess": function(d) { return d[1]; }},
    {"name": "_", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_", /[\s]/], "postprocess": function(d) {return null;}},
    {"name": "CHAR$ebnf$1", "symbols": [/[a-zA-Z]/]},
    {"name": "CHAR$ebnf$1", "symbols": [/[a-zA-Z]/, "CHAR$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "CHAR", "symbols": ["CHAR$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "STRING", "symbols": ["CHAR"], "postprocess": function(d) {return d[0];}},
    {"name": "VAR", "symbols": ["STRING"], "postprocess": function(d) {return ast.Variable([d[0]]); }},
    {"name": "INT$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "INT$ebnf$1", "symbols": [/[0-9]/, "INT$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "INT", "symbols": ["INT$ebnf$1"], "postprocess": function(d) {return d[0].join("");}},
    {"name": "DECIMAL", "symbols": ["INT", {"literal":"."}, "INT"], "postprocess": function(d) {return parseFloat(d[0] + d[1] + d[2]);}},
    {"name": "DECIMAL", "symbols": ["INT"], "postprocess": function(d) {return parseInt(d[0]);}},
    {"name": "NUM", "symbols": ["DECIMAL"], "postprocess": function(d) {return ast.Number([d[0]]);}},
    {"name": "VAL", "symbols": ["VAR"]},
    {"name": "VAL", "symbols": ["NUM"]},
    {"name": "FUNC", "symbols": ["STRING"]},
    {"name": "ADD", "symbols": [{"literal":"+"}]},
    {"name": "SUB", "symbols": [{"literal":"-"}]},
    {"name": "MUL", "symbols": [{"literal":"*"}]},
    {"name": "DIV", "symbols": [{"literal":"/"}]},
    {"name": "MOD", "symbols": [{"literal":"%"}]},
    {"name": "POW", "symbols": [{"literal":"^"}]},
    {"name": "SET", "symbols": [{"literal":"="}]},
    {"name": "EXP", "symbols": ["ASSIGNMENT"]},
    {"name": "ASSIGNMENT", "symbols": ["ASSIGNMENT", "_", "SET", "_", "ADD_SUB"], "postprocess": function(d) {return ast.Assignment([d[0], d[4]]);}},
    {"name": "ASSIGNMENT", "symbols": ["ADD_SUB"], "postprocess": id},
    {"name": "ADD_SUB", "symbols": ["ADD_SUB", "_", "ADD", "_", "MUL_DIV"], "postprocess": function(d) {return ast.Addition([d[0], d[4]]);}},
    {"name": "ADD_SUB", "symbols": ["ADD_SUB", "_", "SUB", "_", "MUL_DIV"], "postprocess": function(d) {return ast.Subtraction([d[0], d[4]]);}},
    {"name": "ADD_SUB", "symbols": ["MUL_DIV"], "postprocess": id},
    {"name": "MUL_DIV", "symbols": ["MUL_DIV", "_", "MUL", "_", "EXPONENTIATION"], "postprocess": function(d) {return ast.Multiplication([d[0], d[4]]);}},
    {"name": "MUL_DIV", "symbols": ["NUM", "_", {"literal":"("}, "_", "EXP", "_", {"literal":")"}], "postprocess": function(d) {return ast.Multiplication([d[0], d[4]]);}},
    {"name": "MUL_DIV", "symbols": ["MUL_DIV", "_", "DIV", "_", "EXPONENTIATION"], "postprocess": function(d) {return ast.Division([d[0], d[4]]);}},
    {"name": "MUL_DIV", "symbols": ["EXPONENTIATION"], "postprocess": id},
    {"name": "EXPONENTIATION", "symbols": ["EXPONENTIATION", "_", "POW", "_", "PARENTHESIS"], "postprocess": function(d) {return ast.Exponentiation([d[0], d[4]]);}},
    {"name": "EXPONENTIATION", "symbols": ["PARENTHESIS"], "postprocess": id},
    {"name": "NEGATION", "symbols": ["SUB", "_", "EXP"], "postprocess": function(d) {return ast.Negation([d[2]]);}},
    {"name": "MODULO", "symbols": ["EXP", "_", "MOD", "_", "EXP"], "postprocess": function(d) {return ast.Modulo([d[0], d[4]]);}},
    {"name": "PARENTHESIS", "symbols": [{"literal":"("}, "_", "ATOMIC", "_", {"literal":")"}], "postprocess": function(d) {return d[2];}},
    {"name": "PARENTHESIS", "symbols": ["ATOMIC"], "postprocess": id},
    {"name": "ATOMIC", "symbols": ["MODULO"]},
    {"name": "ATOMIC", "symbols": ["NEGATION"]},
    {"name": "ATOMIC", "symbols": ["FUNCTION"]},
    {"name": "ATOMIC", "symbols": ["VAL"]},
    {"name": "FUNCTION", "symbols": ["FUNC", "_", {"literal":"("}, "_", "FUNCARGS", "_", {"literal":")"}], "postprocess": function(d) {return ast.Function([d[0]].concat(d[4]));}},
    {"name": "ARGUMENT", "symbols": ["_", "EXP", "_"], "postprocess": function(d) {return d[1];}},
    {"name": "FUNCARGS", "symbols": ["ARGUMENT"], "postprocess": function(d) {return [d[0]];}},
    {"name": "FUNCARGS", "symbols": ["FUNCARGS", "_", {"literal":","}, "_", "ARGUMENT"], "postprocess": function(d) {return d[0].concat(d[4]);}}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

},{"./ast.js":1}],5:[function(require,module,exports){
(function () {
function Rule(name, symbols, postprocess) {
    this.name = name;
    this.symbols = symbols;        // a list of literal | regex class | nonterminal
    this.postprocess = postprocess;
    return this;
}

Rule.prototype.toString = function(withCursorAt) {
    function stringifySymbolSequence (e) {
        return (e.literal) ? JSON.stringify(e.literal)
                           : e.toString();
    }
    var symbolSequence = (typeof withCursorAt === "undefined")
                         ? this.symbols.map(stringifySymbolSequence).join(' ')
                         : (   this.symbols.slice(0, withCursorAt).map(stringifySymbolSequence).join(' ')
                             + " ● "
                             + this.symbols.slice(withCursorAt).map(stringifySymbolSequence).join(' ')     );
    return this.name + " → " + symbolSequence;
}


// a State is a rule at a position from a given starting point in the input stream (reference)
function State(rule, expect, reference) {
    this.rule = rule;
    this.expect = expect;
    this.reference = reference;
    this.data = [];
}

State.prototype.toString = function() {
    return "{" + this.rule.toString(this.expect) + "}, from: " + (this.reference || 0);
};

State.prototype.nextState = function(data) {
    var state = new State(this.rule, this.expect + 1, this.reference);
    state.data = this.data.slice(0);  // make a cheap copy of currentState's data
    state.data.push(data);            // append the passed data
    return state;
};

State.prototype.consumeTerminal = function(inp) {
    var val = false;
    if (this.rule.symbols[this.expect]) {                  // is there a symbol to test?
       if (this.rule.symbols[this.expect].test) {          // is the symbol a regex?
          if (this.rule.symbols[this.expect].test(inp)) {  // does the regex match
             val = this.nextState(inp);  // nextState on a successful regex match
          }
       } else {   // not a regex, must be a literal
          if (this.rule.symbols[this.expect].literal === inp) {
             val = this.nextState(inp);  // nextState on a successful literal match
          }
       }
    }
    return val;
};

State.prototype.consumeNonTerminal = function(inp) {
    if (this.rule.symbols[this.expect] === inp) {
        return this.nextState(inp);
    }
    return false;
};

State.prototype.process = function(location, ind, table, rules, addedRules) {
    if (this.expect === this.rule.symbols.length) {
        // I have completed a rule
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
        if (!(this.data === Parser.fail)) {
            var w = 0;
            // We need a while here because the empty rule will
            // modify table[reference]. (when location === reference)
            var s,x;
            while (w < table[this.reference].length) {
                s = table[this.reference][w];
                x = s.consumeNonTerminal(this.rule.name);
                if (x) {
                    x.data[x.data.length-1] = this.data;
                    x.epsilonClosure(location, ind, table);
                }
                w++;
            }

            // --- The comment below is OUTDATED. It's left so that future
            // editors know not to try and do that.

            // Remove this rule from "addedRules" so that another one can be
            // added if some future added rule requires it.
            // Note: I can be optimized by someone clever and not-lazy. Somehow
            // queue rules so that everything that this completion "spawns" can
            // affect the rest of the rules yet-to-be-added-to-the-table.
            // Maybe.

            // I repeat, this is a *bad* idea.

            // var i = addedRules.indexOf(this.rule);
            // if (i !== -1) {
            //     addedRules.splice(i, 1);
            // }
        }
    } else {
        // I'm not done, but I can predict something
        var exp = this.rule.symbols[this.expect];

        // for each rule
        var me = this;
        rules.forEach(function(r) {
            // if I expect it, and it hasn't been added already
            if (r.name === exp && addedRules.indexOf(r) === -1) {
                // Make a note that you've added it already, and don't need to
                // add it again; otherwise left recursive rules are going to go
                // into an infinite loop by adding themselves over and over
                // again.

                // If it's the null rule, however, you don't do this because it
                // affects the current table row, so you might need it to be
                // called again later. Instead, I just insert a copy whose
                // state has been advanced one position (since that's all the
                // null rule means anyway)

                if (r.symbols.length > 0) {
                    addedRules.push(r);
                    new State(r, 0, location).epsilonClosure(location, ind, table);
                } else {
                    // Empty rule
                    // This is special
                    var copy = me.consumeNonTerminal(r.name);
                    if (r.postprocess) {
                        copy.data[copy.data.length-1] = r.postprocess([], this.reference);
                    } else {
                        copy.data[copy.data.length-1] = [];
                    }
                    copy.epsilonClosure(location, ind, table);
                }
            }
        });
    }
};

State.prototype.isComplete = function() {
    return this.expect === this.rule.symbols.length;
}

/**
 * Computes all possible epsilon-steps from the current state at
 * given location. States 0 through ind-1 in location are considered
 * for possible nullables.
 */
State.prototype.epsilonClosure = function(location, ind, table, result) {
    var col = table[location];
    if (!result) result = table[location]; // convenient common case

    result.push(this);

    if (!this.isComplete()) {
        for (var i = 0; i < ind; i++) {
            var state = col[i];
            if (state.isComplete() && state.reference === location) {
                var x = this.consumeNonTerminal(state.rule.name);
                if (x) {
                    x.data[x.data.length-1] = state.data;
                    x.epsilonClosure(location, ind, table);
                }
            }
        }
    }
}


function Parser(rules, start) {
    var table = this.table = [];
    this.rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
    this.start = start = start || this.rules[0].name;
    // Setup a table
    var addedRules = [];
    this.table.push([]);
    // I could be expecting anything.
    this.rules.forEach(function (r) {
        if (r.name === start) {  // add all rules named start
            addedRules.push(r);
            table[0].push(new State(r, 0, 0));
        }});  // this should refer to this object, not each rule inside the forEach
    this.advanceTo(0, addedRules);
    this.current = 0;
}

// create a reserved token for indicating a parse fail
Parser.fail = {};

Parser.prototype.advanceTo = function(n, addedRules) {
    // Advance a table, take the closure of .process for location n in the input stream
    var w = 0;
    while (w < this.table[n].length) {
        (this.table[n][w]).process(n, w, this.table, this.rules, addedRules);
        w++;
    }
}

Parser.prototype.feed = function(chunk) {
    for (var chunkPos = 0; chunkPos < chunk.length; chunkPos++) {
        // We add new states to table[current+1]
        this.table.push([]);

        // Advance all tokens that expect the symbol
        // So for each state in the previous row,

        for (var w = 0; w < this.table[this.current + chunkPos].length; w++) {
            var s = this.table[this.current + chunkPos][w];
            var x = s.consumeTerminal(chunk[chunkPos]);      // Try to consume the token
            if (x) {
                // And then add it
                this.table[this.current + chunkPos + 1].push(x);
            }
        }

        // Next, for each of the rules, we either
        // (a) complete it, and try to see if the reference row expected that
        //     rule
        // (b) predict the next nonterminal it expects by adding that
        //     nonterminal's start state
        // To prevent duplication, we also keep track of rules we have already
        // added

        var addedRules = [];
        this.advanceTo(this.current + chunkPos + 1, addedRules);

        // If needed, throw an error:
        if (this.table[this.table.length-1].length === 0) {
            // No states at all! This is not good.
            var err = new Error(
                "nearley: No possible parsings (@" + (this.current + chunkPos)
                    + ": '" + chunk[chunkPos] + "')."
            );
            err.offset = this.current + chunkPos;
            throw err;
        }
    }

    this.current += chunkPos;
    // Incrementally keep track of results
    this.results = this.finish();

    // Allow chaining, for whatever it's worth
    return this;
};

Parser.prototype.finish = function() {
    // Return the possible parsings
    var considerations = [];
    var myself = this;
    this.table[this.table.length-1].forEach(function (t) {
        if (t.rule.name === myself.start
                && t.expect === t.rule.symbols.length
                && t.reference === 0
                && t.data !== Parser.fail) {
            considerations.push(t);
        }
    });
    return considerations.map(function(c) {return c.data; });
};

var nearley = {
    Parser: Parser,
    Rule: Rule
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
   module.exports = nearley;
} else {
   window.nearley = nearley;
}
})();

},{}],6:[function(require,module,exports){
(function (global){

// this is a hack because nearley exports bad
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

module.exports = parse;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./math":4,"nearley":5}]},{},[3]);
