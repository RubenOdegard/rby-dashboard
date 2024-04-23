import { cn } from "@/lib/utils";

const TextTitle = ({
  title,
  className,
}: {
  title?: string;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-pretty text-md border/50 border-b pb-1 font-semibold sm:text-lg",
        className,
      )}
    >
      {title || "No title"}
    </h3>
  );
};

export default TextTitle;