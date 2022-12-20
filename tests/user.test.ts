import { createMocks } from "node-mocks-http";
import { prisma } from "../src/server/db/client";

import userApi from "../src/pages/api/user/[query]";

const testUser = {
  userId: "testUser",
};

const resetDatabase = async (): Promise<void> => {
  await prisma.collection.deleteMany({});
  await prisma.user.deleteMany({});
  return;
};

describe("/api/user endpoint", () => {
  beforeAll(async () => {
    return resetDatabase();
  });

  it("POST request should create a user and return the name of the user", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {
        userId: testUser.userId,
      },
    });

    await userApi(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        userName: testUser.userId,
      })
    );
  });

  it("GET request should return the data for the user", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        userId: testUser.userId,
      },
    });

    await userApi(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.getHeaders()).toEqual({ "content-type": "application/json" });
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        userName: testUser.userId,
      })
    );
  });
});
