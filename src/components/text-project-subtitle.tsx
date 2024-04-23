import { cn } from "@/lib/utils";

const TextProjectSubtitle = ({
  title,
  className,
  ...props
}: {
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={cn("text-base font-semibold sm:text-lg", className)}
      {...props}
    >
      {title}
    </div>
  );
};

export default TextProjectSubtitle;