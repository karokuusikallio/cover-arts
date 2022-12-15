import type { NextPage } from "next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import AddCollectionForm from "./AddCollectionForm";
import Link from "next/link";

import getSessionInfo from "./helpers/getSessionInfo";
import getCollections from "./helpers/getCollections";

import { Collection } from "../types";

const Dashboard: NextPage = () => {
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const getInitialCollections = async () => {
      setLoading(true);
      const session = await getSessionInfo();

      if (session && session.user) {
        setUserId(session.user.id);
        const collections = await getCollections(session.user.id);
        setCollections(collections);
        setLoading(false);
      }
    };

    getInitialCollections();
  }, []);

  const handleAddCollection = useMutation({
    mutationFn: async (collectionName: string): Promise<void> => {
      if (userId) {
        setAddModalVisibility(false);
        setLoading(true);
        const response = await fetch(
          `/api/collection/query?collectionName=${collectionName}&userId=${userId}`,
          {
            method: "POST",
          }
        );

        const collectionCreated = await response.json();
        setCollections([...collections, collectionCreated]);
        setLoading(false);
      }
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
    },
  });

  const handleDeleteCollection = useMutation({
    mutationFn: async (collectionId: string): Promise<void> => {
      if (
        window.confirm(
          "Are you sure you want to delete the collection and all records in it?"
        )
      ) {
        const response = await fetch(
          `/api/collection/query?collectionId=${collectionId}`,
          {
            method: "DELETE",
          }
        );

        const collectionDeleted = await response.json();
        const collectionsUpdated = collections.filter(
          (collection) => collection.id !== collectionDeleted.id
        );
        setCollections(collectionsUpdated);
        setAddModalVisibility(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]);
    },
  });

  const dateIntoString = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <div className="my-5 px-5 sm:px-20">
      <h1 className="flex items-center text-xl font-semibold text-spotartPurple">
        My Collections
      </h1>
      <button
        className="text-bold my-5 inline-block h-full rounded-lg bg-spotartPurple p-2 uppercase text-white hover:bg-spotartLightPurple"
        onClick={() => setAddModalVisibility(true)}
      >
        Add new Collection
      </button>
      <AddCollectionForm
        closeModal={() => setAddModalVisibility(false)}
        visibility={addModalVisibility}
        handleAddCollection={handleAddCollection.mutate}
      />
      {loading ? (
        <p>Updating collections...</p>
      ) : collections.length === 0 ? (
        <p>No collections</p>
      ) : (
        collections.map((collection) => (
          <div
            className="my-5 flex justify-between rounded-lg border-2 border-solid border-spotartPurple p-2"
            key={collection.id}
          >
            <Link href={`/collection/${collection.id}`} className="w-full">
              <div className="flex w-1/2 cursor-pointer flex-col text-left">
                <h3 className="text-l flex items-center font-semibold text-spotartPurple hover:text-spotartLightPurple">
                  {collection.collectionName}
                </h3>
                <p>Albums in collection: {collection.albums.length}</p>
                <p>Created: {dateIntoString(collection.createdAt)}</p>
              </div>
            </Link>
            <button
              onClick={() => handleDeleteCollection.mutate(collection.id)}
              className="text-bold m-5 h-full rounded-lg bg-spotartPurple px-2 uppercase text-white hover:bg-spotartLightPurple"
            >
              Delete Collection
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
