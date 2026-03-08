import { useState } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { NavLink } from "react-router";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-6 md:px-10 dark:bg-gray-800 bg-white shadow-sm z-50">
      {/* Brand */}
      <div className="font-bold flex items-center gap-2 m-10">
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-gradient-to-r from-primary to-primary/40 text-white">
          A
        </span>
        <NavLink to={"/"}>
          <span className="text-base tracking-tight">Auth</span>
        </NavLink>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center m-10">
        <NavLink to={"/"}>
          {/* <a href="#">Home</a> */}
          Home
        </NavLink>
        <NavLink to={"/login"}>
          <Button className="cursor-pointer" size="sm" variant="outline">
            Login
          </Button>
        </NavLink>
        <NavLink to={"/signup"}>
          <Button className="cursor-pointer" size="sm" variant="outline">
            Signup
          </Button>
        </NavLink>

        {/* Theme Button AFTER Signup */}
        <ThemeToggle />
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
        <Menu size={24} />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-14 left-0 w-full bg-white dark:bg-gray-800 shadow-md flex flex-col items-center gap-4 py-6 md:hidden">
          <a href="#">Home</a>
          <Button size="sm" variant="outline">
            Login
          </Button>
          <Button size="sm" variant="outline">
            Signup
          </Button>
          
          {/* Theme Button AFTER Signup */}
        <ThemeToggle />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
