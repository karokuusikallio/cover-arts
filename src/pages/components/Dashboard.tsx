import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Collection } from "../../types";
import AddCollectionForm from "./AddCollectionForm";

const Dashboard = () => {
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);

  const { data: session } = useSession();

  const getCollections = async (): Promise<Collection[]> => {
    const response = await fetch("/api/collection");
    const collections = await response.json();
    return collections;
  };

  const { data: collections, status } = useQuery(
    ["collections"],
    getCollections
  );

  const handleAddCollection = async (collectionName: string) => {
    if (session?.user?.id) {
      const response = await fetch("/api/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectionName, userName: session.user.id }),
      });

      const collectionCreated = await response.json();
      console.log(collectionCreated);
      setAddModalVisibility(false);
    }
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
      {status === "loading" && <p>Getting collections...</p>}
      {status === "success" && collections.length > 0 ? (
        collections.map((collection) => (
          <div key={collection.id}>
            <p>{collection.name}</p>
          </div>
        ))
      ) : (
        <p>No collections</p>
      )}
    </div>
  );
};

export default Dashboard;
