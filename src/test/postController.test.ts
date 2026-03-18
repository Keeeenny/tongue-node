import { expect } from "chai";
import * as postController from "../controllers/postController";
import * as userController from "../controllers/userController";
import { ID } from "../utils/types";

describe("PostController - (Integration)", function () {
  let idUser: ID;
  let idPost: ID;

  const createRequest = () =>
    ({
      params: { userId: idUser },
      body: {
        title: "What to do on monday",
        content: "Any suggestions?",
      },
    }) as any;

  const updateRequest = () =>
    ({
      params: { id: idPost, userId: idUser },
      body: {
        title: "Let's go to the zoo!",
        content: "I want to see the pandas",
      },
    }) as any;

  const patchTitleRequest = () =>
    ({
      params: { id: idPost, userId: idUser },
      body: {
        title: "Zoo visit",
      },
    }) as any;

  const patchContentRequest = () =>
    ({
      params: { id: idPost, userId: idUser },
      body: {
        content: "I want to pet red pandas!",
      },
    }) as any;

  const deleteRequest = () =>
    ({
      params: {
        id: idPost,
        userId: idUser,
      },
    }) as any;

  const createResponseMock = () => {
    return {
      statusCode: 0,
      body: {},
      status: function (c: any) {
        this.statusCode = c;
        return this;
      },
      json: function (d: any) {
        this.body = d;
        return this;
      },
    } as any;
  };

  before(async function () {
    const req = {
      body: {
        nickname: "Post Test User",
        age: 99,
        city: "A good city",
      },
    } as any;
    const res = createResponseMock();
    await userController.createUser(req, res);

    idUser = res.body.data.id;

    if (!idUser) {
      throw new Error("Test failed.");
    }

    console.log("Begin test with user ID: ", idUser);
  });

  after(async function () {
    const req = { params: { id: idUser } } as any;
    const res = createResponseMock();

    await userController.deleteUser(req, res);

    if (res.statusCode !== 200) {
      console.warn(
        `[Cleanup Warning]: Could not delete user ${idUser}.`,
      );
    }
    console.log("Test Ended. Deleted user ID: ", idUser);
  });

  //Check
  afterEach(async function () {
    const res = createResponseMock();
    await postController.readPosts({} as any, res);

    console.log("\n--- DB STATUS ---");
    console.table(res.body.data);
  });

  //Create
  it("should create a post", async function () {
    const req = createRequest();
    const res = createResponseMock();

    await postController.createPost(req, res);

    expect(res.statusCode, `Creation failed: ${res.body.message}`).to.equal(201);
    expect(res.body.status).to.equal("success");

    idPost = res.body.data.id;
    console.log(res.body.message, idPost);
  });

  //Update
  it("should update a post", async function () {
    if (!idPost)
      throw new Error("idPost is missing! Create test must pass first.");
    const req = updateRequest();
    const res = createResponseMock();

    await postController.updatePost(req, res);

    
    expect(res.statusCode, `Update failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");

    console.log(res.body.message, idPost);
  });

  //Patch title
  it("should patch post's title", async function () {
    if (!idPost)
      throw new Error("idPost is missing! Create test must pass first.");
    const req = patchTitleRequest();
    const res = createResponseMock();

    await postController.patchPost(req, res);

    expect(res.statusCode, `Patch title failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log(res.body.message, idPost);
  });

  //Patch content
  it("should patch post's content", async function () {
    if (!idPost)
      throw new Error("idPost is missing! Create test must pass first.");
    const req = patchContentRequest();
    const res = createResponseMock();

    await postController.patchPost(req, res);

    expect(res.statusCode, `Patch content failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log(res.body.message, idPost);
  });

  //Delete
  it("should delete a post", async function () {
    if (!idPost)
      throw new Error("idPost is missing! Create test must pass first.");
    const req = deleteRequest();
    const res = createResponseMock();

    await postController.deletePost(req, res);

    expect(res.statusCode, `Deletion failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log(res.body.message);
  });
});
