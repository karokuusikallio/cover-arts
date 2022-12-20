import { createMocks } from "node-mocks-http";
import { prisma } from "../src/server/db/client";

import albumApi from "../src/pages/api/album/[query]";

const testUser = {
  userId: "testUser",
};

const testCollection = {
  collectionName: "testCollection",
  collectionId: "",
};

const testAlbum = {
  albumId: "123123123",
};

const createNewCollection = async (): Promise<void> => {
  await prisma.album.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.user.deleteMany({});
  const userCreated = await prisma.user.create({
    data: { userName: testUser.userId },
  });

  const collectionCreated = await prisma.collection.create({
    data: {
      userName: userCreated.userName,
      collectionName: testCollection.collectionName,
    },
    include: { albums: true },
  });

  testCollection.collectionId = collectionCreated.id;
  return;
};

describe("/api/album endpoint", () => {
  beforeAll(async () => {
    return createNewCollection();
  });

  it("POST request should create a new album and return the id the album and collection", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        collectionId: testCollection.collectionId,
        albumId: testAlbum.albumId,
      },
    });

    await albumApi(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(res._getData()).albumAdded).toEqual({
      albumId: testAlbum.albumId,
    });
    expect(JSON.parse(res._getData()).collectionUpdated).toEqual(
      expect.objectContaining({
        collectionName: testCollection.collectionName,
      })
    );
  });

  it("DELETE request should return the deleted album id and updated collection id", async () => {
    const { req, res } = createMocks({
      method: "DELETE",
      query: {
        collectionId: testCollection.collectionId,
        albumId: testAlbum.albumId,
      },
    });

    await albumApi(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(res._getData()).albumRemoved).toEqual({
      albumId: testAlbum.albumId,
    });
    expect(JSON.parse(res._getData()).collectionUpdated).toEqual(
      expect.objectContaining({
        collectionName: testCollection.collectionName,
      })
    );
  });
});
