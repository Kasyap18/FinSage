
import { WizardShell } from "@/components/wizard/WizardShell";

interface PlaceholderPageProps {
  title: string;
  description: string;
  steps?: string[];
}

export function PlaceholderPage({
  title,
  description,
  steps = ["Step One", "Step Two", "Step Three", "Step Four"],
}: PlaceholderPageProps) {
  return (
    <WizardShell
      title={title}
      subtitle={description}
      steps={steps}
    />
  );
}
