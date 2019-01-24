const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const redis = require('redis');

    const client = redis.createClient();

    
    const util = require('util');
    client.get = util.promisify(client.get);
    //if cached data is available in redis return it from redis server 
    //without hammering mongo server
    const cachedBlogs = await client.get(req.user.id);

    if(cachedBlogs) {
      console.log('serving from cache')
      return res.send(JSON.parse(cachedBlogs));
    }
   //if no data is available req mongo server and update cached server
    

    const blogs = await Blog.find({ _user: req.user.id });
   console.log('serving from mongo server');
    res.send(blogs);
    client.set(req.user.id, JSON.stringify(blogs));
    
  
  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
