import { useState } from "react";
import Modal from "./Modal";

interface AddCollectionProps {
  visibility: boolean;
  handleAddCollection: (collectionName: string) => void;
}

const AddCollectionForm = (props: AddCollectionProps) => {
  const [collectionName, setCollectionName] = useState<string>("");

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.handleAddCollection(collectionName);
  };

  return props.visibility ? (
    <Modal>
      <div>
        <form onSubmit={handleForm}>
          <label>Collection Name</label>
          <input
            type="text"
            value={collectionName}
            onChange={({ target }) => setCollectionName(target.value)}
          ></input>
          <button type="submit">Add</button>
        </form>
      </div>
    </Modal>
  ) : null;
};

export default AddCollectionForm;
