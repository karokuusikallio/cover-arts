import { Tag } from "react-tag-input";

export const keyCodes = {
  comma: 188,
  enter: 13,
};

export const delimiters = [keyCodes.comma, keyCodes.enter];

export const customRender = (tag: Tag) => {
  return (
    <div className="cursor-pointer text-spotartPurple hover:text-spotartLightPurple">
      {tag.text}
    </div>
  );
};
