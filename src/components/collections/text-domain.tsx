import { capitalizeFirstLetter, getDomainName } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const TextDomain = ({
    domain,
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
}: {
    domain?: string;
    isHovered: boolean;
    handleMouseEnter: () => void;
    handleMouseLeave: () => void;
}) => {
    const domainName = domain ? capitalizeFirstLetter(getDomainName(domain)) : "";

    return (
        <Link
            href={domain || ""}
            target="_blank"
            className="flex items-center justify-start gap-2"
        >
            <h3
                className={`text-pretty truncate border-foreground text-xl font-bold decoration-yellow-400 underline-offset-4 transition-all hover:underline sm:text-2xl ${isHovered ? "text-yellow-400" : "text-foreground"
                    }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {domainName || "No domain"}
            </h3>
            <ExternalLink size={12} className="hidden sm:inline" />
        </Link>
    );
};

export default TextDomain;
