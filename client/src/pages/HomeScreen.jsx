import { Link } from "react-router-dom";

function HomeScreen() {
  return (
    <div className="h-screen w-screen overflow-hidden grid grid-cols-2">
      <div className="flex flex-col gap-10 justify-center p-12">
        <h1 className="text-7xl font-bold ">
          Tell your <span className="text-[#407bff]">story</span> to everyone.
        </h1>
        <div>
          <Link to="/blogs">
            <button className="btn-black">Get started →</button>
          </Link>
        </div>
      </div>

      <div>
        <img
          src="/writing.png"
          alt="writing"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}

export default HomeScreen;
