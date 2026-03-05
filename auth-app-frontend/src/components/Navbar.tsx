import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-8 dark:bg-gray-800">
      {/* brand */}
      <div className="font-bold flex items-center gap-2">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-r from-primary to-primary/40 text-white">
          A
        </span>
        <span className="text-base tracking-tight">Auth</span>
      </div>

      {/* buttons */}
      <div className="flex gap-4 items-center">
        <a href="#">Home</a>
        <Button className="cursor-pointer" size="sm" variant="outline">
          Login
        </Button>
        <Button className="cursor-pointer" size="sm" variant="outline">
          Signup
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
