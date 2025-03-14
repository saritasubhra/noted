import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { GoComment } from "react-icons/go";
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
  console.log(blog);

  const publishedAt = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto ">
      <h1 className="text-4xl font-bold capitalize">{title}</h1>

      <div className="flex gap-2 py-8 items-center border-b border-gray-200">
        <img
          src="/defaultUser.png"
          alt="profilePic"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{fullname}</p>
          <p className="text-sm text-gray-600">Published - {publishedAt}</p>
        </div>
      </div>

      <div className="flex justify-between items-center py-3 border-b border-gray-200">
        <div className="flex gap-8">
          <div className="flex gap-1">
            <button
              className="cursor-pointer hover:text-red-500"
              onClick={handleLike}
            >
              {likes.includes(auth?._id) ? (
                <IoIosHeart fill="red" size={22} />
              ) : (
                <IoIosHeartEmpty size={22} />
              )}
            </button>
            <span>{numOfLikes}</span>
          </div>
          <div className="flex gap-1">
            <button>
              <GoComment size={20} />
            </button>
            <span>{comments?.length}</span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {Math.round(content.length / 1000)} min read
        </div>
      </div>

      <div className="flex justify-center items-center py-10">
        <img src={banner} alt="banner" className="w-full object-cover" />
      </div>

      <p className="text-xl font-serif font-thin leading-8 ">{content}</p>

      <form
        className="p-4 my-10 border space-y-4 text-end rounded-md"
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
