import { cn } from "@/lib/utils";

export const reviews = [
  {
    name: "Jack",
    username: "@jack",
    body: "This app saved me hours by tailoring my CV automatically. It matched my skills perfectly to job descriptions.",
    img: "../../../man1.png",
  },
  {
    name: "Jill",
    username: "@jill",
    body: "I was struggling to get interviews with my old CV, but the AI-tailored version got me multiple offers in a week!",
    img: "../../../woman2.png",
  },
  {
    name: "John",
    username: "@john",
    body: "Creating custom CVs for each job used to take forever. Now I can apply to jobs in minutes, and it works!",
    img: "../../../man2.png",
  },
  {
    name: "Jane",
    username: "@jane",
    body: "I had no idea my CV was the issue until I used this app. Now I’m finally getting callbacks from recruiters.",
    img: "../../../woman1.png",
  },
  {
    name: "Jenny",
    username: "@jenny",
    body: "This app has taken the stress out of applying to jobs. I’ve never seen such accurate CV tailoring before.",
    img: "../../../man4.png",
  },
  {
    name: "James",
    username: "@james",
    body: "AI-tailored CVs are a game changer! I’ve applied to more jobs and landed interviews that I couldn’t before.",
    img: "../../../man3.png",
  }
]



export const firstRow = reviews.slice(0, reviews.length / 2);
export const secondRow = reviews.slice(reviews.length / 2);

export const ReviewCard = ({
    img,
    name,
    username,
    body,
  }) => {
    return (
      <figure
        className={cn(
          "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
          // light styles
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          // dark styles
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img className="rounded-full" width="32" height="32" alt="" src={img} />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">{username}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm">{body}</blockquote>
      </figure>
    );
  };