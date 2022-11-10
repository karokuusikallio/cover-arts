import { ReactNode } from "react";

interface ModalProps {
  children?: ReactNode;
}

const Modal = (props: ModalProps) => {
  return (
    <div className="absolute top-0 flex h-screen w-screen items-center justify-center overflow-hidden bg-black/30">
      {props.children}
    </div>
  );
};

export default Modal;
