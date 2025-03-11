import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import BlogCard from "../components/BlogCard";
import Spinner from "../components/Spinner";
// import { useBlog } from "../context/BlogContext";
import { useSearch } from "../context/SearchContext";

function SearchResults() {
  const {
    searchResults,
    setSearchResults,
    searchPage,
    setSearchPage,
    hasMore,
    setHasMore,
    isLoading,
    setIsLoading,
  } = useSearch();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q");

  useEffect(() => {
    fetchBlogsBySearch();

    return () => {
      setSearchResults([]);
      setSearchPage(1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
  console.log(searchPage);

  async function fetchBlogsBySearch() {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/blogs?page=${searchPage}&search=${searchTerm}`
      );
      setSearchResults((prev) => [...prev, ...res.data.data]);
      setHasMore(res.data.hasMore);
      setSearchPage((prev) => prev + 1);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  // async function fetchBlogsBySearch(pageNum = 1) {
  //   try {
  //     setIsLoading(true);
  //     const res = await axios.get(
  //       `/blogs?page=${pageNum}&search=${searchTerm}`
  //     );
  //     setSearchResults((prev) => [...prev, ...res.data.data]);
  //     setHasMore(res.data.hasMore);
  //     setSearchPage(pageNum);
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  if (!searchResults.length) return <Spinner />;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <p className="text-2xl">
        Search results for{" "}
        <span className="font-semibold">&quot;{searchTerm}&quot;</span>
      </p>
      {searchResults.map((blog, i) => (
        <BlogCard key={i} blog={blog} />
      ))}

      {hasMore ? (
        <button
          onClick={fetchBlogsBySearch}
          disabled={isLoading}
          className="btn-white mt-10"
        >
          {isLoading ? "Loading..." : "Load More"}
        </button>
      ) : (
        <p className="mt-10 font-semibold tracking-wide text-lg opacity-40 ">
          No more results
        </p>
      )}
    </div>
  );
}

export default SearchResults;
