import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="flex justify-between items-center border-b p-4 bg-background">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;