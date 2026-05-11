import { Card } from "@ui/components";
import { ThemeToggle } from "@ui/components";

const SettingsPage = () => (
  <div className="space-y-6">
    <h2 className="text-lg font-semibold text-primary">Settings</h2>
    <Card header="Theme">
      <ThemeToggle variant="segmented" />
    </Card>
  </div>
);

export default SettingsPage;
