// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
 var ast = typeof window !== 'undefined' ? window.ast : require('./ast.js'); var grammar = {
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
