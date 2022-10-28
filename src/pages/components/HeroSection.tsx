interface HeroSectionProps {
  backgroundName: string;
  children?: React.ReactNode;
}

const HeroSection = (props: HeroSectionProps) => {
  return (
    <div
      className={`bg-${props.backgroundName} h-28 items-center bg-cover bg-center text-4xl font-bold text-spotartPurple`}
    >
      <div className="flex h-full w-full items-center bg-white/70 px-20">
        {props.children}
      </div>
    </div>
  );
};

export default HeroSection;
