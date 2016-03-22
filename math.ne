
@{% var ast = typeof window !== 'undefined' ? window.ast : require('./ast.js'); %}

main -> _ EXP _ {% function(d) { return d[1]; } %}

_ -> null     {% function(d) {return null;} %}
	| _ [\s]    {% function(d) {return null;} %}

CHAR -> [a-zA-Z]:+      {% function(d) {return d[0].join(""); } %}
STRING -> CHAR          {% function(d) {return d[0];} %}
VAR -> STRING           {% function(d) {return ast.Variable([d[0]]); } %}

INT -> [0-9]:+          {% function(d) {return d[0].join("");} %}
DECIMAL -> INT "." INT  {% function(d) {return parseFloat(d[0] + d[1] + d[2]);} %}
	| INT                 {% function(d) {return parseInt(d[0]);} %}
NUM -> DECIMAL          {% function(d) {return ast.Number([d[0]]);} %}

VAL -> VAR | NUM
FUNC -> STRING

ADD     -> "+"
SUB     -> "-"
MUL     -> "*"
DIV     -> "/"
MOD     -> "%"
POW     -> "^"
SET     -> "="

EXP -> ASSIGNMENT

ASSIGNMENT -> ASSIGNMENT _ SET _ ADD_SUB    {% function(d) {return ast.Assignment([d[0], d[4]]);} %}
            | ADD_SUB                       {% id %}

# ADDITION    -> EXP _ ADD _ EXP    {% function(d) {return ast.Addition([d[0], d[4]]);} %}
# SUBTRACTION -> EXP _ SUB _ EXP    {% function(d) {return ast.Subtraction([d[0], d[4]]);} %}

ADD_SUB -> ADD_SUB _ ADD _ MUL_DIV  {% function(d) {return ast.Addition([d[0], d[4]]);} %}
         | ADD_SUB _ SUB _ MUL_DIV  {% function(d) {return ast.Subtraction([d[0], d[4]]);} %}
         | MUL_DIV                  {% id %}

# MULTIPLICATION          -> EXP _ MUL _ EXP        {% function(d) {return ast.Multiplication([d[0], d[4]]);} %}
# MULTIPLICATION_IMPLICIT -> NUM _ "(" _ EXP _ ")"  {% function(d) {return ast.Multiplication([d[0], d[4]]);} %}
# DIVISION                -> EXP _ DIV _ EXP        {% function(d) {return ast.Division([d[0], d[4]]);} %}

MUL_DIV -> MUL_DIV _ MUL _ EXPONENTIATION {% function(d) {return ast.Multiplication([d[0], d[4]]);} %}
         | NUM _ "(" _ EXP _ ")"          {% function(d) {return ast.Multiplication([d[0], d[4]]);} %}
         | MUL_DIV _ DIV _ EXPONENTIATION {% function(d) {return ast.Division([d[0], d[4]]);} %}
         | EXPONENTIATION                 {% id %}

EXPONENTIATION -> EXPONENTIATION _ POW _ PARENTHESIS {% function(d) {return ast.Exponentiation([d[0], d[4]]);} %}
                | PARENTHESIS                        {% id %}

NEGATION  -> SUB _ EXP          {% function(d) {return ast.Negation([d[2]]);} %}
MODULO    -> EXP _ MOD _ EXP    {% function(d) {return ast.Modulo([d[0], d[4]]);} %}

PARENTHESIS -> "(" _ ATOMIC _ ")" {% function(d) {return d[2];} %}
             | ATOMIC             {% id %}

ATOMIC -> MODULO | NEGATION | FUNCTION | VAL

FUNCTION -> FUNC _ "(" _ FUNCARGS _ ")" {% function(d) {return ast.Function([d[0]].concat(d[4]));} %}
ARGUMENT -> _ EXP _                     {% function(d) {return d[1];} %}
FUNCARGS -> ARGUMENT                    {% function(d) {return [d[0]];} %}
  | FUNCARGS _ "," _ ARGUMENT           {% function(d) {return d[0].concat(d[4]);} %}

