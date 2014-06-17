var _ = require('lodash');

function Watchlist(instance) {
    _this = this;
    _this.list = {};
    _this.instance = instance;
    _.forEach(instance.variables, function(variable) {
        _this.list[variable] = [];
        _this.list['~' + variable] = [];
    });
    _.forEach(instance.clauses, function(clause) {
        _this.list[clause[0].toString()].push(clause);
    });
}

Watchlist.prototype.dump = function dump() {
    _.forEach(this.list, function(clauses, literal) {
        console.log(literal.toString() + ': ' + clauses.join(' -- '));
    });
};

/**
 * Updates the watch list after literal 'falsified_literal' was just assigned
 * False, by making any clause watching falsified_literal watch something else.
 * Returns false it is impossible to do so, meaning a clause is contradicted
 * by the current assignment.
 */
Watchlist.prototype.updateWatchlist = function updateWatchlist(instance, falsified_literal, assignment, verbose) {
    _this = this;
    var findAlternativeForClause = function findAlternativeForClause(clause) {
        return _.find(clause, function(literal) {
            return assignment[literal.variable] === null || assignment[literal.variable] === literal.negated;
        });
    };
    var key = falsified_literal.toString();
    while (_this.list[key].length > 0) {
        var clause = _this.list[key][0];
        if (verbose) {
            console.log('Finding alternative for ' + clause);
        }
        var alternative = findAlternativeForClause(clause);
        if (alternative) {
            if (verbose) {
                console.log('Found alternative ' + alternative + ' for ' + clause);
            }
            _this.list[key].splice(0, 1);
            _this.list[alternative.toString()].push(clause);
        } else {
            if (verbose) {
                console.log('Clause ' + clause + ' contradicted');
                _this.dump();
            }
            return false;
        }
    }
    return true;
};


module.exports = Watchlist;
