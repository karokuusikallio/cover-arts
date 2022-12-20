import { createMocks } from "node-mocks-http";
import { prisma } from "../src/server/db/client";

import collectionApi from "../src/pages/api/collection/[query]";

const testUser = {
  userId: "testUser",
};

const testCollection = {
  collectionName: "testCollection",
};

const createNewUser = async (): Promise<void> => {
  await prisma.collection.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.user.create({
    data: { userName: testUser.userId },
  });
  return;
};

describe("/api/collection endpoint", () => {
  beforeAll(() => {
    return createNewUser();
  });

  it("POST request should create a collection and return the name collection", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        userId: testUser.userId,
        collectionName: testCollection.collectionName,
      },
    });

    await collectionApi(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        collectionName: testCollection.collectionName,
        userName: testUser.userId,
      })
    );
  });

  it("GET request should return the collection created", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        userId: testUser.userId,
      },
    });

    await collectionApi(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(res._getData())).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          collectionName: testCollection.collectionName,
        }),
      ])
    );
  });
});
