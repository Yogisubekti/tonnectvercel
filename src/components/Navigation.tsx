import { Home, Zap, Gift, Users, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Zap, label: "Mine", path: "/mine" },
    { icon: Gift, label: "Spin", path: "/spin" },
    { icon: Users, label: "Rank", path: "/leaderboard" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/50 rounded-t-3xl">
      <div className="flex items-center justify-around px-4 py-3 max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300",
                isActive
                  ? "text-primary neon-text"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform",
                  isActive && "scale-110"
                )}
              />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
