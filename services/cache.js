const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

const redis = require('redis');
const util = require('util');

const client = redis.createClient();

client.get = util.promisify(client.get);

//overwriting more functionality to mongoose query function
mongoose.Query.prototype.exec = function() {
    console.log(`I'm' about to run a query`);
    console.log(this.getQuery());
    console.log(this.mongooseCollection.name);

   const key = JSOM.stringify( Object.assign({},this.getQuery(), {
        collection:this.mongooseCollection.name
    })
   );
    console.log(key);
    return exec.apply(this,arguments);
}