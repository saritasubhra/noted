import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useLogout from "../hooks/useLogout";
import { useState } from "react";
import { FaPenAlt } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CiEdit, CiLogout, CiUser } from "react-icons/ci";

function Navbar() {
  const { auth } = useAuth();
  const { isLoading, handleLogout } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex justify-between items-center flex-wrap gap-4 px-4 sm:px-8 py-2 fixed z-10 bg-white w-screen">
      <Link to="/">
        <div className="font-serif font-bold text-2xl xs:text-3xl flex gap-1">
          Noted.
          <span>
            <FaPenAlt />
          </span>
        </div>
      </Link>

      <div className="relative order-2 sm:order-[0] w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search"
          className="px-4 pt-1 pb-2  border-2 border-gray-300 rounded-full w-full sm:w-auto"
        />
        <IoSearch className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      <ul className="flex items-center gap-2">
        {auth ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center bg-gray-200 p-1 pr-4 rounded-md"
            >
              <span>
                <RiArrowDropDownLine size={30} />
              </span>

              <span>Hi, {auth.fullname}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-lg">
                <Link to="/write">
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
                    <span>
                      <CiEdit size={22} className="font-thin" />
                    </span>
                    <span>Write</span>
                  </li>
                </Link>
                <Link to="/profile">
                  <li className="px-4 py-2 flex items-center gap-2 hover:bg-gray-100">
                    <span>
                      <CiUser size={22} />
                    </span>
                    <span>Profile</span>
                  </li>
                </Link>
                <button
                  className="px-4 py-2 w-full flex items-center gap-2 hover:bg-gray-100"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  <span>
                    <CiLogout size={22} />
                  </span>
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <NavLink to="/signup">
              <li className="btn-black">Signup</li>
            </NavLink>
            <NavLink to="/login">
              <li className="btn-white">Login</li>
            </NavLink>
          </>
        )}
      </ul>
    </header>
  );
}

export default Navbar;
