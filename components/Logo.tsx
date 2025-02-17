import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md";
}

const Logo = ({ size = "md" }: LogoProps) => {
  const textSize = size === "sm" ? "text-2xl" : "text-4xl";
  const imageSize = size === "sm" ? 16 : 24;
  const padding = size === "sm" ? "p-2" : "p-4";
  const margin = size === "sm" ? "mb-2" : "mb-4";

  return (
    <div className={`text-center ${padding}`}>
      <div className={`flex flex-col align-items-start ${margin}`}>
        <div className="flex gap-2 mb-1">
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
          <span className={`w-6 text-light-100 font-bold ${textSize}`}>G</span>
          <Image
            src="/circle.svg"
            alt="Circle"
            width={imageSize}
            height={imageSize}
            className="mt-0.5 ml-2"
          />
          <span className={`font-bold text-light-100 w-6 ml-3 ${textSize}`}>
            English
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
