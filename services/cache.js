const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

const redis = require('redis');
const util = require('util');

const client = redis.createClient();

client.get = util.promisify(client.get);

//overwriting more functionality to mongoose query function
mongoose.Query.prototype.exec =  async function() {
    console.log(`I'm' about to run a query`);
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);

   const key = JSON.stringify( Object.assign({},this.getQuery(), {
        collection:this.mongooseCollection.name
    })
   );

   const cacheValue = await client.get(key);

   if(cacheValue){
       console.log(cacheValue);
       const doc = JSON.parse(cacheValue);
                
    return  Array.isArray(doc)
    ? doc.map(d => new this.model(d)) 
    :new this.model(doc);
       
    }
    // console.log(key);
    const result = await exec.apply(this,arguments);
    client.set(key,JSON.stringify(result));
    return result;
    console.log(result);
}