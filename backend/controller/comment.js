const Comment = require("../model/comment");
const User = require("../model/auth");
// const io = require('../util/socket');
exports.postComment = async(req, res, next) => {
    console.log(req.body.comment);
    const post = new Comment({
        comment: req.body.comment,
        creator: req.userData.userId
    });
    try {
        let user = await User.find({ _id: req.userData.userId });
        console.log('user', user[0].fullName);
        post
            .save()
            .then(createdPost => {
                res.status(201).json({
                    message: "Comment added successfully",
                    post: {
                        //  ...createdPost,
                        id: createdPost._id,
                        comment: createdPost.comment,
                        creator: user[0].fullName,
                        upvotesCount: createdPost.upvotes.length,
                        downvotesCount: createdPost.downvotes.length
                    }
                });
            })
            .catch(error => {
                res.status(500).json({
                    message: "Creating a comment failed!"
                });
            });

    } catch (error) {
        res.status(500).json({
            message: "Creating a comment failed!"
        });
    }

};

exports.getComment = async(req, res, next) => {
    try {

        let comments = await Comment.find({}).populate("creator", "fullName");

        let responseData = comments.map(v => {
            return {
                commentId: v._id,
                comment: v.comment,
                creator: v.creator.fullName,
                upvotesCount: v.upvotes.length,
                downvotesCount: v.downvotes.length
            }
        });
        //   console.log('responsedata', responseData);
        res.status(200).send(responseData);
    } catch (error) {
        res.status(500).json({
            message: "Creating a comment failed!"
        });
    }
};