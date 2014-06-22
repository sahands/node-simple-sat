var should = require('should');
var satinstance = require('../satinstance');
var solver = require('../solver');

var solveInstanceLine = function solveInstanceLine(line) {
    var instance = new satinstance.SATInstance();
    instance.parseAndAddClauses(line);
    return solver.solve(instance, false);
};

describe('solver', function() {
    describe('solve()', function() {
        it('A; ~A; is not satisfiable.', function() {
            should(solveInstanceLine('A; ~A;')).not.be.ok;
        });
        it('A B; A ~B; is satisfiable.', function() {
            should(solveInstanceLine('A B; A ~B;')).be.ok;
        });
        it('A B C; A ~B C; A B ~C; is satisfiable.', function() {
            should(solveInstanceLine('A B C; ~A ~B C; A B ~C;')).be.ok;
        });
        it('A B ~C; B C; ~B; ~A C; is satisfiable.', function() {
            should(solveInstanceLine('A B ~C; B C; ~B; ~A C;')).be.ok;
        });
    });
});
