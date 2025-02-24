import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import CommentCard from "../components/CommentCard";
import { useAuth } from "../context/AuthContext";

function BlogDetails() {
  const [blog, setBlog] = useState();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchABlogs() {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    fetchABlogs();
  }, [id]);

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!auth) {
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(`/comments`, { blogId: id, comment: input });
      setBlog({ ...blog, comments: [...blog.comments, res.data.data] });
      setInput("");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleLike() {
    if (!auth) {
      navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.patch(`/blogs/like/${id}`);
      setBlog({
        ...blog,
        likes: res.data.data.likes,
        numOfLikes: res.data.data.numOfLikes,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (!blog) return <Spinner />;

  const {
    author: { fullname },
    banner,
    title,
    content,
    comments,
    likes,
    numOfLikes,
    createdAt,
  } = blog;

  const publishedAt = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-10">
      <h1 className="text-4xl font-bold capitalize">{title}</h1>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img
            src="/defaultUser.png"
            alt="profilePic"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{fullname}</p>
            <p className="text-sm">{publishedAt}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="cursor-pointer hover:text-red-500"
            onClick={handleLike}
          >
            {likes.includes(auth?._id) ? (
              <IoIosHeart fill="red" size={25} />
            ) : (
              <IoIosHeartEmpty size={25} />
            )}
          </button>
          <span>{numOfLikes}</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img src={banner} alt="banner" className="w-full object-cover" />
      </div>

      <p className="text-xl font-serif font-thin leading-8 ">{content}</p>

      <form
        className="p-4 border space-y-4 text-end rounded-md"
        onSubmit={handleCommentSubmit}
      >
        <textarea
          name="comment"
          placeholder="Add a comment..."
          className="input"
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>

        <button className="btn-black" disabled={isLoading}>
          Submit
        </button>
      </form>

      <div>
        <h1 className="text-2xl font-bold">Comments ({comments.length})</h1>

        {comments.map((item, i) => (
          <CommentCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default BlogDetails;
