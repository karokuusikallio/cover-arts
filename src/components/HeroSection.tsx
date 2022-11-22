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
    ? `bg-${props.backgroundName}`
    : `bg-record-store`;

  if (props.backgroundName === "none") {
    bgClass = "";
    bgColor = "";
  }

  console.log(bgClass);

  return (
    <div
      className={`h-28 items-center ${bgClass} bg-cover bg-center bg-no-repeat text-4xl font-bold text-spotartPurple`}
    >
      <div className={`flex h-full w-full items-center ${bgColor} px-20`}>
        {props.children}
      </div>
    </div>
  );
};

export default HeroSection;
