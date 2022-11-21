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
    setCollectionName("");
  };

  return props.visibility ? (
    <Modal>
      <div className="h-1/3 w-1/2 bg-white p-5">
        <h2 className="text-l inline font-semibold text-spotartPurple">
          Create New Collection
        </h2>
        <button
          className="text-bold float-right h-8 w-8 rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
          onClick={() => props.closeModal()}
        >
          X
        </button>
        <div className="flex justify-between align-middle">
          <form
            onSubmit={handleForm}
            className="flex w-2/3 flex-col p-2 [&>*]:m-2"
          >
            <label>Collection Name</label>
            <input
              type="text"
              className="rounded-lg border-2 border-spotartPurple"
              value={collectionName}
              onChange={({ target }) => setCollectionName(target.value)}
            ></input>
            <button
              className="text-bold mx-5 max-w-xs rounded-lg bg-spotartPurple p-1 uppercase text-white hover:bg-spotartLightPurple"
              type="submit"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default AddCollectionForm;
