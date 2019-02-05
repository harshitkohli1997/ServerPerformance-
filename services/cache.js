const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function() {
    console.log(`I'm' about to run a query`);
    return exec.apply(this,arguments);
}