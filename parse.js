
var nearley = require('nearley');
var grammar = require('./math');

function parse(str) {
  var parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  var output = parser.feed(str).results;
  var ast = clean(output);
  // console.log(JSON.stringify(ast, null, 2));
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

