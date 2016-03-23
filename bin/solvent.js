
var nopt = require('nopt');
var path = require('path');
var Stream = require('stream').Stream;
var readline = require('readline');

var solvent = require('../');

var options = {
  parse: String,
  compute: String,
  evaluate: String,
  solve: String,
};

var shortOptions = {
  p: 'parse',
  c: 'compute',
  e: 'evaluate',
  s: 'solve',
};

var data = nopt(options, shortOptions);

if(process.argv.length === 2) {
  // repl
  var r = readline.createInterface(process.stdin, process.stdout);
  r.setPrompt('> ');
  r.prompt();

  var running = '';

  function input(statement) {
    try {
      var exp = solvent.parse(statement);
      // console.log(exp);
      var val = solvent.compute(exp);
      console.log(val);
    } catch(error) {
      throw error;
    }
  }

  r.on('line', function(line) {
    if(line.slice(-1) === '\\') {
      running += line.slice(0, -1);
    } else {
      running += line;
      input(running);
      running = '';
    }
    r.prompt();
  }).on('close', function() {
    console.log('');
    process.exit(0);
  });
}


