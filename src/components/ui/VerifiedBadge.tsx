import { Check } from "lucide-react";

export const VerifiedBadge = () => (
  <span
    className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-sky-500 shadow-sm"
    title="Verified"
  >
    <Check className="text-white h-3 w-3" strokeWidth={3} />
  </span>
);
