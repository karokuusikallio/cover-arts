import { theme } from "../../../tailwind.config.cjs";

interface HeroSectionProps {
  backgroundName: string;
  children?: React.ReactNode;
}

const HeroSection = (props: HeroSectionProps) => {
  const backgroundClass = theme?.extend?.backgroundImage?.hasOwnProperty(
    `${props.backgroundName}`
  )
    ? `bg-${props.backgroundName}`
    : `bg-record-store`;

  return (
    <div
      className={`${backgroundClass} h-28 items-center bg-record-store bg-cover bg-center bg-no-repeat text-4xl font-bold text-spotartPurple`}
    >
      <div className="flex h-full w-full items-center bg-white/70 px-20">
        {props.children}
      </div>
    </div>
  );
};

export default HeroSection;
