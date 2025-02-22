import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md";
}

const Logo = ({ size = "md" }: LogoProps) => {
  const textSize = size === "sm" ? "text-2xl" : "text-4xl";
  const imageSize = size === "sm" ? 16 : 24;
  const padding = size === "sm" ? "p-2" : "p-4";
  const margin = size === "sm" ? "mb-2" : "mb-4";
  const width = size === "sm" ? "w-4" : "w-6";
  const gap = size === "sm" ? "gap-1.5" : "gap-2";
  const marginLeft = size === "sm" ? "ml-1.5" : "ml-2";

  return (
    <div className={`text-center ${padding}`}>
      <div className={`flex flex-col ${margin}`}>
        <div className={`flex ${gap} mb-1`}>
          {Array(2)
            .fill(0)
            .map((_, index) => (
              <Image
                key={`circle-top-${index}`}
                src="/circle.svg"
                alt="Circle"
                width={imageSize}
                height={imageSize}
                className="circle-asset"
              />
            ))}
        </div>

        <div className="flex items-center">
          <span className={`${width} text-light-100 font-bold ${textSize}`}>
            G
          </span>
          <Image
            src="/circle.svg"
            alt="Circle"
            width={imageSize}
            height={imageSize}
            className={marginLeft}
          />
          <span
            className={`${width} font-bold text-light-100 ml-3 ${textSize}`}
          >
            English
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
