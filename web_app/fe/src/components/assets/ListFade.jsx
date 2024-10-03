import { FadeText } from "@/components/ui/fade-text";

export const ListFade = ({ title, items, direction }) => (
    <div className="flex flex-col gap-4">
    <FadeText
    className="text-2xl text-black dark:text-white rajdhani-bold"
    direction="right"
    framerProps={{
      show: { transition: { delay: 0.5 } },
    }}
    text={title}
  />
  {items.map((item, index) => (
    <FadeText
      key={index}
      className="text-black dark:text-white rajdhani-regular"
      direction={direction}
      framerProps={{
        show: { transition: { delay: 0.5 } },
      }}
      text={item}
    />
  ))}   
  </div>
)