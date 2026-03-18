import { ID } from "../../utils/types";
import { createResponseMock } from "./test.utils";
import * as postController from "../../controllers/postController";
import * as userController from "../../controllers/userController";

export const createTestUsers = async (): Promise<{
  userId: ID;
  newUserId: ID;
}> => {
  //Original User
  const userReq = {
    body: {
      nickname: "First user",
      age: 99,
      city: "London",
    },
  } as any;

  const userRes = createResponseMock();
  await userController.createUser(userReq, userRes);

  console.log(userRes);

  const userId = handleResponse(userRes);

  //New User
  const newUserReq = {
    body: {
      nickname: "Second User",
      age: 109,
      city: "Stockholm",
    },
  } as any;

  const newUserRes = createResponseMock();
  await userController.createUser(newUserReq, newUserRes);

  console.log(newUserRes);

  const newUserId = handleResponse(newUserRes);

  return { userId, newUserId };
};

export const createTestPosts = async (
  userId: ID,
  newUserId: ID,
): Promise<{ postId: ID; newPostId: ID }> => {
  //Original Post
  const postReq = {
    params: {
      userId: userId,
    },
    body: {
      title: "Olympics",
      content: "Main thread",
    },
  } as any;

  const postRes = createResponseMock();
  await postController.createPost(postReq, postRes);

  console.log(postRes);

  const postId = handleResponse(postRes);


  //New post
  const newPostReq = {
    params: {
      userId: newUserId,
    },
    body: {
      title: "Zoo visit",
      content: "Let's pet the pandas",
    },
  } as any;

  const newPostRes = createResponseMock();
  await postController.createPost(newPostReq, newPostRes);

  const newPostId = handleResponse(newPostRes);

  return { postId, newPostId };
};


const handleResponse = (res: any) => {
  if (res.statusCode !== 201) {
    console.error("Error, user not created:", res.body);
    throw new Error(
      `Test failed. Status: ${res.statusCode}, Message: ${res.body.message}`,
    );
  }

  const userId = res.body.data.id;

  if (userId === undefined) {
    throw new Error(`Test failed. unable to create a test User`);
  }

  return userId;
};