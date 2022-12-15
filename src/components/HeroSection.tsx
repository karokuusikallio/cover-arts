import { theme } from "../../tailwind.config.cjs";

interface HeroSectionProps {
  backgroundName: string;
  children?: React.ReactNode;
}

const HeroSection = (props: HeroSectionProps) => {
  let bgColor = `bg-white/70`;
  let bgClass = theme?.extend?.backgroundImage?.hasOwnProperty(
    `${props.backgroundName}`
  )
    ? `url("/img/${props.backgroundName}.jpg")`
    : `url("/img/record-store.jpg")`;

  if (props.backgroundName === "none") {
    bgClass = "none";
    bgColor = "";
  }

  return (
    <div
      style={{ backgroundImage: `${bgClass}` }}
      className={`h-28 items-center bg-cover bg-center bg-no-repeat text-4xl font-bold text-spotartPurple`}
    >
      <div
        className={`flex h-full w-full items-center ${bgColor} px-5 sm:px-20`}
      >
        {props.children}
      </div>
    </div>
  );
};

export default HeroSection;
