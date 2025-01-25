const posts = require('../models/postModel')
const mongoose = require('mongoose');

// add post
exports.addPostController = async (req, res) => {
    console.log("Inside addPostController");
    const userId = req.userId; // Extracted from JWT middleware
    const { username, title, description } = req.body;
    const media = req.file ? req.file.filename : null;

    try {
        const newPost = new posts({
            userId, // Store the user ID
            username,
            title,
            description,
            media,
        });
        await newPost.save();
        res.status(200).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(401).json(err);
    }
};

// to get all posts 
exports.allPostController = async (req, res) => {
    // console.log("Inside getAllPostController");
    const searchKey = req.query.search
    console.log(searchKey);

    const query = {
        title: {
            $regex: searchKey, $options: 'i'
        }
    }
    try {
        const allPosts = await posts.find(query).populate('userId'); // to get profilePic from users
        res.status(200).json(allPosts);
    } catch (err) {
        console.error(err);
        res.status(401).json(err);
    }
};

//edit and update post
exports.editPostController = async (req, res) => {
    // console.log("Inside editPostController");
    const id = req.params.id
    const userId = req.userId
    const { username, title, description, media } = req.body
    const reUploadMedia = req.file ? req.file.filename : media
    try {
        const updatePost = await posts.findByIdAndUpdate({ _id: id }, {
            userId, username, title, description, media: reUploadMedia

        }, { new: true })           // {new:true} for updation
        await updatePost.save()      // to save changes in mongodb
        res.status(200).json(updatePost)
    } catch (err) {
        res.status(401).json(err)
    }

}

// remove post
exports.removePostController = async (req, res) => {
    // console.log(("Inside removePostController"));
    const { id } = req.params
    try {
        const deletePost = await posts.findByIdAndDelete({ _id: id })
        res.status(200).json(deletePost)
    } catch (err) {
        res.status(401).json(err)
    }
}
// to like post
exports.updateLikesController = async (req, res) => {
    console.log("Inside updateLikesController");
    const { id } = req.params; // Post ID to update
    const userId = req.userId;
    // console.log("Current User Id" + userId);

    // User ID of the liker/unliker (assuming it's set by middleware)

    try {
        // Find the post and update the likes array
        const post = await posts.findById(id);
        if (!post) {
            return res.status(404).json("Post Not Fount");
        } else {
            // Check if the user has already liked the post
            const hasLiked = post.likes.includes(userId);

            // console.log(hasLiked);


            // Update the likes array
            const updatedLikes = hasLiked
                ? post.likes.filter((id) => id !== userId) // Remove like
                : [...post.likes, userId]; // Add like
            console.log(updatedLikes);

            // Save the updated post
            const updatedPostLike = await posts.findByIdAndUpdate(
                { _id: id },
                { likes: updatedLikes },
                { new: true } // Return the updated document
            );
            await updatedPostLike.save()
            res.status(200).json(updatedPostLike)
        }

    } catch (err) {
        console.error("Error updating likes:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Function to add a comment to a post
exports.addCommentController = async (req, res) => {
    const { id } = req.params; // Get post ID from request parameters
    const { userId, comment, username, userProfilePic } = req.body; // Get user ID and comment from request body
    // console.log(id);

    try {
        // Find the post by ID
        const post = await posts.findById(id);
        if (!post) {

            return res.status(404).json({ message: "Post not found" });

        } else {
            // Add the new comment to the comments array
            post.comments.push({ userId, comment, username, userProfilePic });
            const updatePost = await post.save(); // Save the updated post
            res.status(200).json(updatePost);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Function to remove a comment from a post
exports.removeCommentController = async (req, res) => {
    console.log("Inside removeCommentController");

    const { id } = req.params; // This is the comment ID to remove
    const { postId } = req.body; // This is the post ID
    console.log("Comment ID:", id, "Post ID:", postId);
    try {
        // Find the post by ID
        const post = await posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        // console.log("Current Comments:", post.comments);
        // Convert commentIdToRemove to ObjectId
        const commentIdToRemove = new mongoose.Types.ObjectId(id);
        // Filter out the comment to remove using .equals()
        const updatedComments = post.comments.filter(comment => !comment._id.equals(commentIdToRemove));
        // console.log("Updated Comments:", updatedComments);

        // Update the post's comments in the database
        post.comments = updatedComments;
        await post.save(); // Save the updated post

        res.status(200).json({ message: "Comment removed successfully", updatedComments });
    } catch (error) {
        console.error("Error removing comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.getUserPostsController = async (req, res) => {
    console.log("Inside getUser PostsController");

    // Correctly extract userId from req.params
    const userId = req.params;
    console.log("User  ID:", userId);

    try {
        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Fetch posts for the user
        const allUserPost = await posts.find({ userId: userObjectId });

        // Check if posts were found
        if (allUserPost.length === 0) {
            return res.status(404).json({ message: "No posts found for this user." });
        }
        res.status(200).json(allUserPost);
        console.log(allUserPost);
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).json({ message: "Internal Server Error" }); // Change to 500 for server errors
    }
};

// to Save Fav Post
exports.updateSavedPostsController = async (req, res) => {
    console.log('Inside updateSavedPostsController');
    const { id } = req.params; // Post's ID
    const { userId } = req.body; //Current  Users ID to Save/remove
    const postId = id 
    console.log('Current User Id:', userId);
    console.log('Post ID:', id);
   
    try {

        const userIdObjectId = new mongoose.Types.ObjectId(userId);

        // Find the current user by their ID
        const post = await posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post Not Found' });
        }

        // Check if the post is in the target users saved Posts
        const isSaved = post.savedUsers.some((user) => user.equals(userIdObjectId));
        console.log('Is Saved:', isSaved);

        if (isSaved) {
            // Remove the post from saved post
            post.savedUsers = post.savedUsers.filter((user) => !user.equals(userIdObjectId));
        } else {
            // Add the user to friends
            post.savedUsers.push(userIdObjectId);
        }
        // Save the updated user
        const updatedSavedPosts = await post.save();
        res.status(200).json(updatedSavedPosts);
    } catch (err) {
        console.error('Error saving user:', err.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};


// // to get only the saved post by user
// exports.getSavedPostsController = async (req,res) => {
//     const { id } = req.params; // Current User's ID
//     try {
//         const user = await users.findById(id).populate('savedPosts')
//         res.status(200).json(user.savedPosts);
//     } catch (err) {
//         console.error(err);
//         res.status(401).json(err);
//     }
// }
