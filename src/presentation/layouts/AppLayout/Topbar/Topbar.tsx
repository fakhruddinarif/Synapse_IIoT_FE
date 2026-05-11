import { ThemeToggle } from "@ui/components";
import { ConnectionStatus } from "./ConnectionStatus";
import { UserMenu } from "./UserMenu";

/** Top application bar with status widgets. */
export const Topbar = () => (
  <header className="flex items-center justify-between border-b border-default bg-surface px-6 py-4">
    <div className="text-sm font-semibold text-primary">Operations Console</div>
    <div className="flex items-center gap-3">
      <ConnectionStatus />
      <ThemeToggle variant="icon-button" />
      <UserMenu />
    </div>
  </header>
);
