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
  "ibm",
  "adobe",
  "salesforce",
  "microsoft",
  "openai",
  "netflix",
  "uber",
  "intel",
  "mercedes",
  "barclays",
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
    <div className="relative flex size-full w-[25vw] items-center justify-center overflow-hidden rounded-lg ">
      <IconCloud iconSlugs={slugs} />
    </div>
  );
}
