const Post = require("../models/Post");

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, urgency } = req.body;

    const newPost = new Post({
      user: req.user.id,
      title,
      content,
      category,
      urgency,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
        .populate("user", "name avatar")
        .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("user", "name avatar");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to update this post" });

    const { title, content, category, urgency } = req.body;
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.urgency = urgency || post.urgency;

    const updated = await post.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating post", error: err.message });
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this post" });

    await post.remove();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
};

// Like / Unlike post
exports.toggleLikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const liked = post.likes.includes(userId);

    if (liked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like", error: err.message });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.unshift({
      user: req.user.id,
      text,
    });

    await post.save();
    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// Get user's own posts
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts", error: err.message });
  }
};
