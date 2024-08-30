const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');

// Create a new post with image upload
// exports.createPost = async (req, res) => {
//   try {
//     let imageUrl = '';

//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       imageUrl = result.secure_url;
//     }

//     const post = new Post({
//       title: req.body.title,
//       content: req.body.content,
//       imageUrl: imageUrl,
//     });

//     await post.save();
//     console.log('POST /api/posts - New post added:', post);
//     res.status(201).json(post);
//   } catch (error) {
//     console.error('POST /api/posts - Error adding post:', error);
//     res.status(500).json({ message: error.message });
//   }
// };
exports.createPost = async (req, res) => {
  try {
    let imageUrl = '';

    if (req.file) {
      console.log('Attempting to upload file:', req.file.path);
      try {
        const result = await cloudinary.uploader.upload(req.file.path);
        console.log('Cloudinary upload successful:', result);
        imageUrl = result.secure_url;
      } catch (error) {
        console.error('Cloudinary upload failed:', error);
        throw error; // Re-throw the error to handle it later
      }
    }
    

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imageUrl: imageUrl,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error('GET /api/posts - Error fetching posts:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('GET /api/posts/:id - Error fetching post:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a post with image upload
exports.updatePost = async (req, res) => {
  try {
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        imageUrl: imageUrl,
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('PUT /api/posts/:id - Post updated:', updatedPost);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('PUT /api/posts/:id - Error updating post:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('DELETE /api/posts/:id - Post deleted:', deletedPost);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/posts/:id - Error deleting post:', error);
    res.status(500).json({ message: error.message });
  }
};
