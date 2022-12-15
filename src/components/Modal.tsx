import { ReactNode } from "react";

interface ModalProps {
  children?: ReactNode;
}

const Modal = (props: ModalProps) => {
  return (
    <div className="absolute top-0 left-0 z-[1001] flex h-screen w-screen items-center justify-center overflow-x-hidden overflow-y-scroll bg-black/30">
      {props.children}
    </div>
  );
};

export default Modal;
