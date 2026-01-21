import { cn } from "@/lib";
import { getImageSrc } from "@/utils/getImageSrc";
type TProps = React.ComponentProps<"img">;

export default function AppImage({ src, alt, className, ...props }: TProps) {
  return (
    <img
      src={getImageSrc(src || "")}
      alt={alt}
      className={cn("w-full object-cover", className)}
      onError={(e) =>
        (e.currentTarget.src =
          "https://www.centerforempathy.org/wp-content/uploads/2019/11/placeholder.png")
      }
      {...props}
    />
  );
}
