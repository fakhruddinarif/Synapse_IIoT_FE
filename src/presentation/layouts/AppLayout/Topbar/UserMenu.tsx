import { Avatar } from "@ui/components";
import { useAuthStore } from "@app/store/useAuthStore";

/** Topbar user summary. */
export const UserMenu = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex items-center gap-2">
      <Avatar name={user?.name ?? "Operator"} size="sm" />
      <span className="hidden text-xs text-secondary md:block">
        {user?.name ?? "Operator"}
      </span>
    </div>
  );
};
