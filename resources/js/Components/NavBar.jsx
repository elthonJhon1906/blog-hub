export default function NavBar() {
    return (
        <div className="sticky top-0 z-50 w-full bg-white">
            <div className="navbar bg-base-500 shadow-sm px-40 max-lg:px-6 max-md:px-4">
                <div className="dropdown">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost lg:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {" "}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />{" "}
                        </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                    >
                        <li>
                            <a>Kategori 1</a>
                        </li>
                        <li>
                            <a>Kategori 2</a>
                            <ul className="p-2">
                                <li>
                                    <a>Sub Kategori 1</a>
                                </li>
                                <li>
                                    <a>Sub Kategori 2</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a>Item 3</a>
                        </li>
                    </ul>
                </div>
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">BlogHub</a>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search"
                        className="input input-bordered w-24 md:w-auto"
                    />
                    <div className="dropdown dropdown-end">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li>
                                <a>Settings</a>
                            </li>
                            <li>
                                <a>Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="w-full bg-base-100 shadow-sm max-lg:hidden bg-blue-900 text-white px-40 max-lg:px-0">
                <ul className="flex h-14">
                    <li>
                        <button
                            className="px-3 h-full flex items-center"
                            popoverTarget="popover-1"
                            style={{
                                anchorName: "--anchor-1",
                            }}
                        >
                            Teknologi
                        </button>

                        <ul
                            className="dropdown dropdown-hover menu w-40 bg-base-100 shadow-sm bg-blue-900"
                            popover="auto"
                            id="popover-1"
                            style={{
                                positionAnchor: "--anchor-1",
                            }}
                        >
                            <li>
                                <a>Artificial Intelegent</a>
                            </li>
                            <li>
                                <a>Internet of Things</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <button
                            className="px-3 h-full flex items-center"
                            popoverTarget="popover-2"
                            style={{
                                anchorName: "--anchor-2",
                            }}
                        >
                            Kategori 2
                        </button>

                        <ul
                            className="dropdown dropdown-hover menu w-40 bg-base-100 shadow-sm bg-blue-900"
                            popover="auto"
                            id="popover-2"
                            style={{
                                positionAnchor: "--anchor-2",
                            }}
                        >
                            <li>
                                <a>Item 1</a>
                            </li>
                            <li>
                                <a>Item 2</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <button
                            className="px-3 h-full flex items-center"
                            popoverTarget="popover-3"
                            style={{
                                anchorName: "--anchor-3",
                            }}
                        >
                            Kategori 3
                        </button>

                        <ul
                            className="dropdown dropdown-hover menu w-40 bg-base-100 shadow-sm bg-blue-900"
                            popover="auto"
                            id="popover-3"
                            style={{
                                positionAnchor: "--anchor-3",
                            }}
                        >
                            <li>
                                <a>Item 1</a>
                            </li>
                            <li>
                                <a>Item 2</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            {/* <div className="navbar bg-base-100 shadow-sm max-lg:hidden bg-blue-900 text-white">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost lg:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {" "}
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />{" "}
                            </svg>
                        </div>
                        <ul
                            tabIndex="-1"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                        >
                            <li>
                                <a>Kategori 1</a>
                            </li>
                            <li>
                                <a>Kategori 2</a>
                                <ul className="p-2">
                                    <li>
                                        <a>Sub Kategori 1</a>
                                    </li>
                                    <li>
                                        <a>Sub Kategori 2</a>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a>Item 3</a>
                            </li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl">BlogHub</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <button
                                className="px-3 h-full flex items-center"
                                popoverTarget="popover-1"
                                style={
                                    {
                                        anchorName: "--anchor-1",
                                    } 
                                }
                            >
                                Teknologi
                            </button>

                            <ul
                                className="dropdown dropdown-hover menu w-40 bg-base-100 shadow-sm bg-blue-900"
                                popover="auto"
                                id="popover-1"
                                style={
                                    {
                                        positionAnchor: "--anchor-1",
                                    } 
                                }
                            >
                                <li>
                                    <a>Artificial Intelegent</a>
                                </li>
                                <li>
                                    <a>Internet of Things</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button
                                className="px-3 h-full flex items-center"
                                popoverTarget="popover-2"
                                style={
                                    {
                                        anchorName: "--anchor-2",
                                    } 
                                }
                            >
                                Kategori 2
                            </button>

                            <ul
                                className="dropdown dropdown-hover menu w-40 bg-base-100 shadow-sm bg-blue-900"
                                popover="auto"
                                id="popover-2"
                                style={
                                    {
                                        positionAnchor: "--anchor-2",
                                    } 
                                }
                            >
                                <li>
                                    <a>Item 1</a>
                                </li>
                                <li>
                                    <a>Item 2</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button
                                className="px-3 h-full flex items-center"
                                popoverTarget="popover-3"
                                style={
                                    {
                                        anchorName: "--anchor-3",
                                    } 
                                }
                            >
                                Kategori 3
                            </button>

                            <ul
                                className="dropdown dropdown-hover menu w-40 bg-base-100 shadow-sm bg-blue-900"
                                popover="auto"
                                id="popover-3"
                                style={
                                    {
                                        positionAnchor: "--anchor-3",
                                    } 
                                }
                            >
                                <li>
                                    <a>Item 1</a>
                                </li>
                                <li>
                                    <a>Item 2</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div className="navbar-end">
                    <a className="btn">Login</a>
                    <a className="btn">Register</a>
                </div>
            </div> */}
        </div>
    );
}
