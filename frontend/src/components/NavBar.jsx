const NavBar = () => {
    return (
      <nav className="bg-gray-900 text-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="text-2xl font-bold">MySite</div>
          <ul className="flex space-x-6">
            <li><a href="/" className="hover:text-blue-400">Home</a></li>
            <li><a href="/match" className="hover:text-blue-400">Match</a></li>
            <li><a href="/profile" className="hover:text-blue-400">My Profile</a></li>
          </ul>
        </div>
      </nav>
    );
  };
  
  export default NavBar;
  