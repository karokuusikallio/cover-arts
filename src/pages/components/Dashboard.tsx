import type { NextPage } from "next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Collection } from "../../types";
import AddCollectionForm from "./AddCollectionForm";
import Link from "next/link";

import getCollections from "./helpers/getCollectionsQuery";

const Dashboard: NextPage = () => {
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);

  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: collections, status } = useQuery(
    ["collections", session?.user?.id],
    () => getCollections(session?.user?.id)
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
        closeModal={() => setAddModalVisibility(false)}
        visibility={addModalVisibility}
        handleAddCollection={handleAddCollection.mutate}
      />
      {status === "loading" ? (
        <p>Getting collections...</p>
      ) : status === "success" &&
        collections &&
        collections.length > 0 &&
        session?.user?.id ? (
        collections.map((collection) => (
          <div key={collection.id}>
            <Link href={`/collection/${collection.id}`}>{collection.name}</Link>
          </div>
        ))
      ) : (
        <p>No collections</p>
      )}
    </div>
  );
};

export default Dashboard;
