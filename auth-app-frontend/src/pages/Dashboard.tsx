import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Dashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoading } = useLogout();

  return (
    <div className="flex items-center justify-center min-h-full px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>You are logged in.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {user && (
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Roles:</span>{" "}
                {user.roles.join(", ")}
              </p>
            </div>
          )}

          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={logout}
            disabled={isLoading}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
