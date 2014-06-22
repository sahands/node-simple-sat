var _ = require('lodash');
var should = require('should');
var satinstance = require('../satinstance');
var solver = require('../solver');


/**
 * See TAOCP Section 7.2.2.2, page 4 for details.
 *
 * @return {SATInstance} object clauses for waerden(j, k; n)
 */
var waerdenInstance = function waerdenInstance(n, j, k) {
    var instance = new satinstance.SATInstance();
    var q = j;
    var negated = false;
    var variables = {};
    for (var round = 0; round < 2; round++) {
        for (var d = 1; d <= (n / (q - 1)); d++) {
            for (var i = 1; i <= n - (q - 1) * d; i++) {
                clause = [];
                for (var l = 0; l < q; l++) {
                    var literal = new satinstance.Literal((i + l * d).toString(), negated);
                    clause.push(literal);
                    variables[literal.variable] = true;
                }
                instance.clauses.push(clause);
            }
        }
        q = k;
        negated = true;
    }
    for (var variable in variables) {
        instance.variables.push(variable);
    }
    return instance;
};


/**
 * Use the SAT solver to calculate W(j, k)
 *
 * @param j
 * @param k
 * @return W(j, k)
 */
var W = function W(j, k) {
    // Van der Waerden theorem means the following loop will always terminate
    for (var n = 1;; n++) {
        var instance = waerdenInstance(n, j, k);
        if (solver.solve(instance) === null) {
            return n;
        }
    }
};

describe('solver', function() {
    describe('solve()', function() {
        var knownW = {
            3: {
                3: 9,
                4: 18,
                5: 22,
                6: 32,
                7: 46,
                // Getting too slow here
                // 8: 58,
                // 9: 77,  
                // 10: 97
            },
            4: {
                4: 35,
                5: 55,
                // 6: 73
            },
            5: {
                // 5: 178
            }
        };
        _.forEach(knownW, function(Wj, j) {
            _.forEach(Wj, function(w, k) {
                var funcStr = 'W(' + j + ', ' + k + ')';
                it(funcStr + ' should be ' + w, function() {
                    var calculatedW = W(j, k);
                    // console.log(funcStr + ' = ' + calculatedW);
                    calculatedW.should.be.equal(w);
                });
            });
        });
    });
});
