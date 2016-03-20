
var $ = require('jquery');
var solvent = require('./');

//--
function $dom(selector, props, content) {
  var tagName = selector.split('#')[0].split('.')[0];
  if(selector.indexOf('#') !== -1) {
    props.id = selector.split('#')[1].split('.')[0];
  }
  
  var attrs = selector.slice(tagName.length).split('#');
  var classNames = attrs[0].split('.')
    .concat(attrs[1].split('.').slice(1))
    .filter(function(x) {return x.trim().length;});
  props.className = ((props.className||'')+' '+classNames).trim(); 

  tagName = tagName || 'div';
  var tagBody = Object.keys(props)
    .filter(function(key) {return props[key];})
    .map(function(key) {
      var mKey = key === 'className' ? 'class' : key;
      return hyphenCase(camelCase(mKey, true))+'=\"'+props[key]+'\"';
    }).join(' ');
  if(tagBody.length) tagBody = ' '+tagBody;

  if(!content) {
    return '<'+tagName+tagBody+'/>';
  } else {
    if(Array.isArray(content)) content = content.join('');
    return '<'+tagName+tagBody+'>'+content+'</'+tagName+'>';
  }
}

function hyphenCase(words, split) {
  return split
    ? words.split('-')
    : words.join('-');
}

function snakeCase(words, split) {
  return split
    ? words.split('_')
    : words
      .map(function(x) {return x.toLowerCase();})
      .join('_');
}

function camelCase(words, split) {
  return split
    ? words.replace(/(A-Z){1}/g, function(x) {
        return ' '+x.toLowerCase();
      }).join(' ')
    : words.map(function(w, i) {
        if(i === 0) return w;
        return w.charAt(0).toUpperCase() + w.slice(1);
      }).join('');
}

var d = $dom;
//--

var context = solvent.Context([], Math);

var $expressionList = $('#expression-list');
var $expressionCreate = $('#expression-create');

$expressionCreate.on('submit', function(e) {
  e.preventDefault();
  var str = $(this).serialize().string;
  this.reset();
  context.expressions.push(solvent.parse(str));
  $expressionList.html(renderContext(context));
});

function renderContext(context) {
  return d('ul.expression-list', {}, context.expressions.map(function(exp, index) {
    return d('li.expression', {id: 'exp-'+index}, [
      d('.equation', {}, renderEquation(exp, context)),
      d('.computed', {}, solvent.compute(solvent.evaluate(exp, context))),
    ]);
  }));
}

function renderEquation(eq, context) {
  function renderNode(node) {
    
  }
}

