import { expect } from "chai";
import * as postController from "../controllers/postController";
import * as userController from "../controllers/userController";
import * as interactionController from "../controllers/interactionController";
import { ID, InteractionType } from "../utils/types";
import { createResponseMock } from "./helpers/test.utils";
import {
  createTestUsers,
  createTestPosts,
} from "./helpers/interaction.fixtures";

describe.only("Interaction Controller - (Integration)", function () {
  let userId: ID;
  let newUserId: ID;
  let postId: ID;
  let newPostId: ID;
  let interaction_Id_A: ID;
  let interaction_Id_B: ID;

  const createCommentRequest = () =>
    ({
      params: { userId: userId, postId: postId },
      body: {
        type: InteractionType.COMMENT,
        content: "Hockey results",
      },
    }) as any;

  const createLikeRequest = () =>
    ({
      params: { userId: userId, postId: postId },
      body: {
        type: InteractionType.LIKE,
      },
    }) as any;

  const commentToLikeRequest = () =>
    ({
      params: { id: interaction_Id_A },
      body: {
        user_id: newUserId,
        post_id: newPostId,
        type: InteractionType.LIKE,
        content: null,
      },
    }) as any;

  const likeToCommentRequest = () =>
    ({
      params: { id: interaction_Id_B },
      body: {
        user_id: newUserId,
        post_id: newPostId,
        type: InteractionType.COMMENT,
        content: "Hello Richard",
      },
    }) as any;

  const patchCommentRequest = () =>
    ({
      params: { id: interaction_Id_B, userId: newUserId },
      body: {
        type: InteractionType.COMMENT,
        content: "Zoo visit",
      },
    }) as any;

  const deleteCommentRequest = () =>
    ({
      params: {
        id: interaction_Id_B,
        userId: newUserId,
      },
    }) as any;

  const deleteLikeRequest = () =>
    ({
      params: {
        id: interaction_Id_A,
        userId: newUserId,
      },
    }) as any;

  before(async function () {
    try {
      // Create users
      const usersIds = await createTestUsers();
      userId = usersIds.userId;
      newUserId = usersIds.newUserId;
      console.log("Begin test with users ID: ", userId, ", ", newUserId);

      // Create posts
      const postsIds = await createTestPosts(userId, newUserId);
      postId = postsIds.postId;
      newPostId = postsIds.newPostId;
      console.log("Begin test with posts ID: ", postId, ", ", newPostId);
    } catch (error) {
      console.log("Error in before hook:", error);
      throw error;
    }
  });

  after(async function () {
    //Delete post
    const postReq = {
      params: { id: postId, userId: userId },
    } as any;
    const postRes = createResponseMock();

    await postController.deletePost(postReq, postRes);

    const newPostReq = {
      params: { id: newPostId, userId: newUserId },
    } as any;
    const newPostRes = createResponseMock();

    await postController.deletePost(newPostReq, newPostRes);
    //Delete Users
    const userReq = {
      params: { id: userId, userId: userId },
    } as any;
    const userRes = createResponseMock();

    await userController.deleteUser(userReq, userRes);

    const newUserReq = { params: { id: newUserId, userId: newUserId } } as any;
    const newUserRes = createResponseMock();

    await userController.deleteUser(newUserReq, newUserRes);

    console.log("Test Ended. Deleted users ID: ", userId, ", ", newUserId);
    console.log("Test Ended. Deleted posts ID: ", postId, ", ", newPostId);
  });

  //Check
  afterEach(async function () {
    const res = createResponseMock();
    await interactionController.readInteractions({} as any, res);

    console.log("\n--- DB STATUS ---");
    console.table(res.body.data);
  });

  //Create comment
  it("should create a comment", async function () {
    const req = createCommentRequest();
    const res = createResponseMock();

    await interactionController.createInteraction(req, res);

    expect(res.statusCode, `Creation failed: ${res.body.message}`).to.equal(201);
    expect(res.body.status).to.equal("success");

    interaction_Id_A = res.body.data.id;
    console.log(res.body.message, interaction_Id_A);
  });

  //Create like
  it("should send a like", async function () {
    const req = createLikeRequest();
    const res = createResponseMock();

    await interactionController.createInteraction(req, res);

    expect(res.statusCode, `Creation failed: ${res.body.message}`).to.equal(201);
    expect(res.body.status).to.equal("success");

    interaction_Id_B = res.body.data.id;
    console.log(res.body.message, interaction_Id_B);
  });

  //Create like duplicate
  it("should return an error when creating a duplicate like", async function () {
    const req = createLikeRequest();
    const res = createResponseMock();

    await interactionController.createInteraction(req, res);

    expect(res.statusCode).to.equal(409);
    expect(res.body.status).to.equal("error");

    console.log(res.body.message);
  });

  //Update comment ALL ADMIN ONLY
  it("should transform a comment into a like (Admin)", async function () {
    if (!interaction_Id_A)
      throw new Error("Interaction is missing! Create test must pass first.");

    const req = commentToLikeRequest();
    const res = createResponseMock();

    await interactionController.updateInteraction(req, res);

    expect(res.statusCode, `Update failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");

    console.log(res.body.message, newPostId);
  });

  //Update like ALL ADMIN ONLY
  it("should transform a like into a comment (Admin)", async function () {
    if (!interaction_Id_B)
      throw new Error("Interaction is missing! Create test must pass first.");

    const req = likeToCommentRequest();
    const res = createResponseMock();

    await interactionController.updateInteraction(req, res);

    expect(res.statusCode, `Update failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");

    console.log(res.body.message, newPostId);
  });

  //Patch comment
  it("should patch a comment", async function () {
    if (!interaction_Id_B)
      throw new Error("Comment is missing! Create test must pass first.");
    const req = patchCommentRequest();
    const res = createResponseMock();

    await interactionController.patchComment(req, res);

    expect(res.statusCode, `Patch failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log(res.body.message, interaction_Id_B);
  });

  //Delete comment
  it("should delete a comment", async function () {
    if (!interaction_Id_B)
      throw new Error("Comment is missing! Create test must pass first.");
    const req = deleteCommentRequest();
    const res = createResponseMock();

    await interactionController.deleteInteraction(req, res);

    expect(res.statusCode, `Delete failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log(res.body.message);
  });

  //Delete like
  it("should delete a like", async function () {
    if (!interaction_Id_A)
      throw new Error("idLike is missing! Create test must pass first.");
    const req = deleteLikeRequest();
    const res = createResponseMock();

    await interactionController.deleteInteraction(req, res);

    expect(res.statusCode, `Delete failed: ${res.body.message}`).to.equal(200);
    expect(res.body.status).to.equal("success");
    console.log(res.body.message);
  });
});
