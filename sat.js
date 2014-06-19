var instance = require('./instance');
var recursiveSatSolve = require('./recursive_solver');


// console.log((new instance.Literal('3', 0)).toString());
// process.exit();

instance.fromStream(process.stdin, function(instance) {
    assignment = recursiveSatSolve(instance, false);
    if (assignment) {
        console.log(instance.assignmentToString(assignment));
    } else {
        console.log("Unsatisfiable");
    }
});
