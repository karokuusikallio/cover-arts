import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Collection } from "../../types";
import AddCollectionForm from "./AddCollectionForm";

import getSeveralAlbums from "./helpers/getSeveralAlbums";

const Dashboard = () => {
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const getCollections = async (): Promise<Collection[] | undefined> => {
    if (session?.user?.id) {
      const response = await fetch(`/api/collection/${session.user.id}`);
      const collections = await response.json();
      return collections;
    }
    return;
  };

  const { data: collections, status } = useQuery(
    ["collections"],
    getCollections
  );

  const handleAddCollection = useMutation({
    mutationFn: async (
      collectionName: string
    ): Promise<Collection | undefined> => {
      if (session?.user?.id) {
        const response = await fetch("/api/collection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ collectionName, userName: session.user.id }),
        });

        const collectionCreated = await response.json();
        setAddModalVisibility(false);
        return collectionCreated;
      }
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
    },
  });

  return (
    <div className="m-5 border-4 border-solid">
      <h1>This is dashboard</h1>
      <button onClick={() => setAddModalVisibility(true)}>
        Add new Collection
      </button>
      <AddCollectionForm
        visibility={addModalVisibility}
        handleAddCollection={handleAddCollection.mutate}
      />
      {status === "loading" ? (
        <p>Getting collections...</p>
      ) : status === "success" &&
        collections &&
        collections.length > 0 &&
        session?.user?.id ? (
        collections.map((collection) => {
          const albums = getSeveralAlbums(
            session?.user?.id as string,
            collection
          );
          console.log(albums);
          return;
        })
      ) : (
        <p>No collections</p>
      )}
    </div>
  );
};

export default Dashboard;
