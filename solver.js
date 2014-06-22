var _ = require('lodash');
var Watchlist = require('./watchlist');
var Literal = require('./satinstance').Literal;

/**
 * Recursively solve SAT by assigning to variables d, d+1, ..., n-1. Assumes
 * variables 0, ..., d-1 are assigned so far. A generator for all the
 * satisfying assignments is returned.
 *
 * @param instance
 * @param watchlist
 * @param assignment
 * @param d
 * @param verbose
 * @return {undefined}
 */
var solve = function solve(instance, watchlist, assignment, d, verbose) {
    if (d === instance.variables.length) {
        return assignment;
    }

    var variable = instance.variables[d];

    for (var a = false;; a = !a) {
        if (verbose) {
            console.log('Trying ' + instance.variables[d] + ' = ' + a);
        }
        assignment[variable] = a;
        falsified_literal = new Literal(variable, a);
        if (watchlist.updateWatchlist(instance, falsified_literal, assignment, verbose)) {
            if (solve(instance, watchlist, assignment, d + 1, verbose)) {
                return assignment;
            }
        }
        if (a) break;
    }

    assignment[variable] = null;
    return null;
};


module.exports.solve = function recursiveSatSolve(instance, verbose) {
    var assignment = {};
    _.forEach(instance.variables, function(variable) {
        assignment[variable] = null;
    });
    var watchlist = new Watchlist(instance);
    return solve(instance, watchlist, assignment, 0, verbose);
};
