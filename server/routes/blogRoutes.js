const express = require("express");
const {
  getAllBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  mostLikedBlogs,
  getBlogsByCategory,
} = require("../controllers/blogController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.route("/most-liked").get(mostLikedBlogs);
router.route("/category/:categoryId").get(getBlogsByCategory);
router.route("/").get(getAllBlogs).post(protect, createBlog);
router
  .route("/:blogId")
  .get(getBlog)
  .patch(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route("/like/:blogId").patch(protect, likeBlog);

module.exports = router;
