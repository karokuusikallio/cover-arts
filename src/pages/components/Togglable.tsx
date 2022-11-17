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
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => props.setVisibility(!props.visible)}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={() => props.setVisibility(!props.visible)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Togglable;
