import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaRegPauseCircle, FaRegStopCircle } from "react-icons/fa";
import { FaRegCirclePlay } from "react-icons/fa6";
import { PiSpeakerHighLight } from "react-icons/pi";
import { GoComment } from "react-icons/go";
import CommentCard from "../components/CommentCard";
import { useAuth } from "../context/AuthContext";

function BlogDetails() {
  const [blog, setBlog] = useState();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchABlog() {
      try {
        const res = await axios.get(`/blogs/${id}`);
        setBlog(res.data.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    fetchABlog();
  }, [id]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel(); // Cleanup speech synthesis on unmount
    };
  }, []);

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

  const handleReadAloud = () => {
    if (!content) return;

    if (isPaused) {
      speechSynthesis.resume();
      setIsSpeaking(true);
      setIsPaused(false);
      return;
    }

    speechSynthesis.cancel();

    const newUtterance = new SpeechSynthesisUtterance(
      content.slice(currentCharIndex)
    );
    newUtterance.lang = "en-US";
    newUtterance.rate = 1;
    newUtterance.pitch = 1;

    newUtterance.onboundary = (event) => {
      setCurrentCharIndex(event.charIndex); // Track the last spoken position
    };

    newUtterance.onend = () => {
      setIsSpeaking(false);
      setCurrentCharIndex(0);
    };

    speechSynthesis.speak(newUtterance);
    setIsSpeaking(true);
  };

  const handlePause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsSpeaking(false);
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel(); // Stop speech
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentCharIndex(0);
  };

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
    category: { categoryName },
  } = blog;
  // console.log(blog);

  const publishedAt = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto mt-44">
      <div className="h-[400px]">
        <img src={banner} alt="banner" className="w-full h-full object-cover" />
      </div>
      <div className="text-xs uppercase flex justify-between py-7">
        <div>
          <span className="px-2 bg-black text-white">{categoryName}</span>
          <span className="ml-4">{publishedAt}</span>
        </div>
        <div className="text-red-500 font-bold">{fullname}</div>
      </div>

      <div className="flex justify-between items-center py-2 border-y border-gray-200">
        <div className="text-gray-400">
          {Math.round(content.length / 1000)} min read
        </div>

        <div className="flex gap-8">
          <div>
            {isSpeaking ? (
              <button onClick={handlePause}>
                <FaRegPauseCircle size={24} />
              </button>
            ) : (
              <button onClick={handleReadAloud}>
                {isPaused ? (
                  <FaRegCirclePlay size={24} />
                ) : (
                  <PiSpeakerHighLight size={24} />
                )}
              </button>
            )}
          </div>

          <div>
            <button onClick={handleStop}>
              <FaRegStopCircle size={24} />
            </button>
          </div>
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
      </div>

      <h1 className="text-2xl font-bold capitalize tracking-tight leading-6 pt-6 pb-4">
        {title}
      </h1>

      <p>{content}</p>

      {/* COMMENT FORM */}
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

      {/* ALL COMMENTS */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          Comments ({comments.length})
        </h1>

        {comments.map((item, i) => (
          <CommentCard key={i} item={item} />
        ))}
      </div>
    </div>
  );
}

export default BlogDetails;
