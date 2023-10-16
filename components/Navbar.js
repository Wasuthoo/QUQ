import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="flex justify-start">
        <Link href="/">
          <h1 className="px-2 text-white  cursor-pointer">Homepage</h1>
        </Link>
        <Link href="/dashboard">
          <h1 className="px-2 text-white cursor-pointer">Dashboard</h1>
        </Link>
        <Link href="/room">
          <h1 className="px-2 text-white cursor-pointer">Room</h1>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
