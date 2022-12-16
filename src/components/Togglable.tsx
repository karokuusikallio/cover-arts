import { ReactNode } from "react";

interface TogglableProps {
  buttonLabel: string;
  children?: ReactNode;
  visible: boolean;
  setVisibility: (visible: boolean) => void;
}

const Togglable = (props: TogglableProps) => {
  const hideWhenVisible = { display: props.visible ? "none" : "" };
  const showWhenVisible = { display: props.visible ? "" : "none" };

  return (
    <div className="w-full">
      <div style={hideWhenVisible}>
        <button
          className="text-bold my-5 rounded-lg bg-spotartPurple py-1 px-4 uppercase text-white hover:bg-spotartLightPurple"
          onClick={() => props.setVisibility(!props.visible)}
        >
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button
          className="text-bold m-2 rounded-lg bg-spotartPurple p-1 px-3 uppercase text-white hover:bg-spotartLightPurple"
          onClick={() => props.setVisibility(!props.visible)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Togglable;
