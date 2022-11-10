import { useSession } from "next-auth/react";
import { useState } from "react";
import AddCollectionForm from "./AddCollectionForm";

const Dashboard = () => {
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);

  const { data: session } = useSession();

  const handleAddCollection = (collectionName: string) => {
    console.log(
      `Add new collection with name ${collectionName} for user ${session.user?.id}`
    );
    setAddModalVisibility(false);
  };

  return (
    <div className="m-5 border-4 border-solid">
      <h1>This is dashboard</h1>
      <button onClick={() => setAddModalVisibility(true)}>
        Add new Collection
      </button>
      <AddCollectionForm
        visibility={addModalVisibility}
        handleAddCollection={handleAddCollection}
      />
    </div>
  );
};

export default Dashboard;
