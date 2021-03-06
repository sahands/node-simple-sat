var satinstance = require('./satinstance');
var solver = require('./solver');


satinstance.fromStream(process.stdin, function(instance) {
    assignment = solver.solve(instance, false);
    if (assignment) {
        console.log(instance.assignmentToString(assignment));
    } else {
        console.log("Unsatisfiable");
    }
});
