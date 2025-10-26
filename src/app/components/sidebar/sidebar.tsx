import { useSkipLocationRouter } from "@/contexts/router.context";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useSkipLocationRouter();
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      e.currentTarget.closest("#sidebar") ||
      e.currentTarget.closest("#toggleSidebar")
    ) {
      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-20`}
      >
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => handleNavigation("/")}
              >
                <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
                Home
              </button>
            </li>
            
            <li>
              <button
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => handleNavigation("/articles")}
              >
                Article
              </button>
            </li>

            <li>
              <button
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => handleNavigation("/posts")}
              >
                Posts
              </button>
            </li>

            <li>
              <button
                className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={() => handleNavigation("/login")}
              >
                Signin
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <button
        id="toggleSidebar"
        className="md:hidden fixed top-4 left-4 p-2 bg-gray-800 text-white rounded-lg z-30"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
          onClick={handleOutsideClick}
        ></div>
      )}
    </>
  );
}
