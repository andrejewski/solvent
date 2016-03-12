
@{% var ast = window ? window.ast : require('./ast.js'); %}

main -> _ EXP _ {% function(d) { return d[1]; } %}

_ -> null     {% function(d) {return null; } %}
	| _ [\s]    {% function(d) {return null; } %}

CHAR -> [a-zA-Z]:+      {% function(d) {return d[0].join(""); } %}
STRING -> CHAR          {% function(d) {return d[0];} %}
  | CHAR CHAR           {% function(d) {return d[0] + d[1];} %}
VAR -> STRING           {% function(d) {return ast.Variable(d[0]); } %}

INT -> [0-9]:+          {% function(d) {return d[0].join(""); } %}
DECIMAL -> INT "." INT  {% function(d) {return parseFloat(d[0] + d[1] + d[2])} %}
	| INT                 {% function(d) {return parseInt(d[0])} %}
NUM -> DECIMAL          {% function(d) {return ast.Number(d[0]);} %}

VAL -> VAR | NUM

ADD     -> "+"
SUB     -> "-"
MUL     -> "*"
DIV     -> "/"
MOD     -> "%"
POW     -> "^" | "**"

EXP -> "(" _ EXP _ ")" {% function(d) { return d[2]; } %}
  | VAL

ADDITION    -> EXP _ ADD _ EXP    {% (d) => ast.Addition(d[0], d[4]); }
SUBTRACTION -> EXP _ SUB _ EXP    {% (d) => ast.Subtraction(d[0], d[4]); }
NEGATION    -> SUB _ EXP          {% (d) => ast.Negate(d[2]); }

MULTIPLICATION  -> EXP _ MUL _ EXP {% (d) => ast.Multiplication(d[0], d[4]); %}
DIVISION        -> EXP _ DIV _ EXP {% (d) => ast.Division(d[0], d[4]); %}

EXPONENTIATION  -> EXP _ POW _ EXP {% (d) => ast.Exponentiation(d[0], d[4]); %}

MODULO -> EXP _ MOD _ EXP {% (d) => ast.Modulo(d[0], d[4]); %}




