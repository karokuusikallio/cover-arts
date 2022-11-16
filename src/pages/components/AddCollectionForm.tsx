import { useState } from "react";
import Modal from "./Modal";

interface AddCollectionProps {
  visibility: boolean;
  closeModal: () => void;
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
      <div className="flex h-1/4 w-1/2 justify-center bg-white align-middle">
        <form onSubmit={handleForm} className="[&>*]:m-2">
          <label>Collection Name</label>
          <input
            type="text"
            value={collectionName}
            onChange={({ target }) => setCollectionName(target.value)}
          ></input>
          <button
            className="text-bold mx-5 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
            type="submit"
          >
            Add
          </button>
        </form>
        <button
          className="text-bold relative top-0 right-0 m-5 h-8 w-8 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
          onClick={() => props.closeModal()}
        >
          X
        </button>
      </div>
    </Modal>
  ) : null;
};

export default AddCollectionForm;
