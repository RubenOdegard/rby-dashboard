import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";

const DialogPlusButton = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Button
      variant="default"
      size="icon"
      className={cn("w-full sm:w-12", className)}
      {...props}
    >
      {children}
      <PlusIcon size={12} />
    </Button>
  );
};

export default DialogPlusButton;
