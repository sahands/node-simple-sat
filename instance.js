var _ = require('lodash');
var readline = require('readline');

function Literal(variable, negated) {
    this.variable = variable;
    this.negated = negated;
}

Literal.prototype.toString = function toString() {
    return (this.negated ? '~' : '') + this.variable;
};

function SATInstance() {
    this.variables = [];
    this.clauses = [];
}

SATInstance.prototype.parseAndAddClause = function parseAndAddClause(sourceLine) {
    _this = this;
    var line = sourceLine.replace(/(^\s+|\s+$)/g, '');
    var clause = [];
    _.forEach(line.split(/\s+/), function(literal) {
        var negated = (literal[0] === '~') ? 1 : 0;
        var variable = literal.substring(negated);
        if (!_.contains(_this.variables, variable)) {
            _this.variables.push(variable);
        }
        var literalObject = new Literal(variable, negated);
        clause.push(literalObject);
    });
    _this.clauses.push(clause);
};


SATInstance.prototype.clauseToString = function clauseToString(clause) {
    return clause.join(' ');
};

SATInstance.prototype.assignmentToString = function assignmentToString(assignment) {
    return JSON.stringify(assignment);
};

module.exports.Literal = Literal;
module.exports.SATInstance = SATInstance;
module.exports.fromStream = function fromStream(stream, callback) {
    var instance = new SATInstance();
    var rd = readline.createInterface({
        input: stream,
        output: process.stderr,
        terminal: false
    });

    rd.on('line', function(line) {
        if (line.length > 0 && line[0] !== '#') {
            instance.parseAndAddClause(line);
        }
    });

    stream.on('end', function() {
        callback(instance);
    });
};
