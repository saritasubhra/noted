import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { IoIosHeartEmpty } from "react-icons/io";

function BlogDetails() {
  const [blog, setBlog] = useState();
  const { id } = useParams();

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

  if (!blog) return <Spinner />;
  console.log(blog);

  const {
    author: { fullname },
    banner,
    title,
    content,
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
          <button className="cursor-pointer">
            <IoIosHeartEmpty size={25} />
          </button>
          <span>32</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <img src={banner} alt="banner" className="w-full object-cover" />
      </div>

      <p className="text-xl font-serif font-thin leading-8 ">{content}</p>
    </div>
  );
}

export default BlogDetails;
