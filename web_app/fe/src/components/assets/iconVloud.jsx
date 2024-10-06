import IconCloud from "@/components/ui/icon-cloud";

const slugs = [
  "nike",
  "google",
  "x",
  "nvidia",
  "amazon",
  "apple",
  "bmw",
  "airbnb",
  "hubspot",
  "attlasian",
  "adobe",
  "salesforce",
  "microsoft",
  "openai",
  "netflix",
  "uber",
  "intel",
  "mercedes",
  "starbucks",
  "meta",
  "tesla",
  "dell",
  "zoom",
  "anthropic",
  "ford",
  "fedex",
  "samsung",
  "linkedin",
  "canva",
  "figma",
];

export function IconCloudDemo() {
  return (
    <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg border bg-background px-20 pb-20 pt-8 ">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}
