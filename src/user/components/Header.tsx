import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="w-screen h-20 flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="w-1/4 flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">WAIT IT : IT</span>
        </div>
      </div>

      <div className="flex items-center w-full justify-center ">
        <nav className="flex items-center justify-between w-2/4 ">
          <Link
            to="/"
            className="  hover:text-[#50d71e] transition-colors duration-200 font-medium text-sm"
          >
            PRODUCT
          </Link>
          <Link
            to="/"
            className=" hover:text-[#50d71e] transition-colors duration-200 font-medium text-sm"
          >
            SOLUTION
          </Link>
          <Link
            to="/"
            className=" hover:text-[#50d71e] transition-colors duration-200 font-medium text-sm"
          >
            PRICING
          </Link>
          <Link
            to="/"
            className=" hover:text-[#50d71e] transition-colors duration-200 font-medium text-sm"
          >
            SUPPORT
          </Link>
          <Link
            to="/"
            className=" hover:text-[#50d71e] transition-colors duration-200 font-medium text-sm"
          >
            CONTACT
          </Link>
          <Link
            to="/"
            className=" hover:text-[#50d71e] transition-colors duration-200 font-medium text-sm"
          >
            OTHER
          </Link>
        </nav>
      </div>
      <div className="w-1/4 flex items-center justify-end space-x-4 w-1/4">
        <button
          className="text-gray-700 hover:text-teal-500 transition-colors duration-200 font-medium text-sm"
          onClick={() => navigate("/login")}
        >
          로그인
        </button>
      </div>
    </header>
  );
};

export default Header;
