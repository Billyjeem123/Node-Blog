const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poststatus: { type: Boolean, default: 'Published' }, // Assuming boolean value for post status
  desc: { type: String, required: true },
  allow: { type: Boolean }
});

const Post = mongoose.model('tblpost', postSchema);

module.exports = Post;
