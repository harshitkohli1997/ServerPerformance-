const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

const redis = require('redis');
const util = require('util');

const client = redis.createClient();

client.hget = util.promisify(client.hget);

mongoose.Query.prototype.cache = function(options = {}){
    this._cache = true;
    this.hashKey = JSON.stringify(options.key || ''/*empty key if no user set key */ );
    return this;
}

//overwriting more functionality to mongoose query function
mongoose.Query.prototype.exec =  async function() {
    console.log(this._cache);
    if(!this._cache){
        return  exec.apply(this,arguments);
     }
    console.log(`I'm' about to run a query`);
    // console.log(this.getQuery());
    // console.log(this.mongooseCollection.name);

   const key = JSON.stringify( Object.assign({},this.getQuery(), {
        collection:this.mongooseCollection.name
    })
   );
    console.log(key);
   const cacheValue = await client.hget(this.hashKey,key);
// if we have value for key in redis return that
   if(cacheValue){
       //console.log(cacheValue);
       const doc = JSON.parse(cacheValue);
           //if doc is array then parse each in array into model     
    return  Array.isArray(doc)
    ? doc.map(d => new this.model(d)) 
    :new this.model(doc);
       
    }
    // console.log(key);
    //else store val in redis
    const result = await exec.apply(this,arguments);
    client.set(key,JSON.stringify(result));
    return result;
    console.log(result);
}

module.exports = {
    clearHash(hashkey){
        client.del(JSON.stringify(hashkey));
    }
}