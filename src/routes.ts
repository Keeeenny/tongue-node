import { Router } from "express";
import { createPost, readPosts, updatePost, deletePost, patchPost } from "./controllers/postController";
import { createUser, readUsers, updateUser, deleteUser, patchUser } from "./controllers/userController";
import { createInteraction, readInteractions, updateInteraction, deleteInteraction, patchComment  } from "./controllers/interactionController";

const router = Router();

//User
router.post("/users", createUser);
router.get("/users", readUsers);
router.put("/users/:id", updateUser);
router.patch("/users/:id", patchUser);
router.delete("/users/:id", deleteUser);

//Post
router.post("/posts/user/:userId", createPost);
router.get("/posts", readPosts);
router.put("/posts/:id/user/:userId", updatePost);
router.patch("/posts/:id/user/:userId", patchPost);
router.delete("/posts/:id/user/:userId", deletePost);

//Interaction
router.post("/posts/:postId/interactions/user/:userId", createInteraction);
router.get("/interactions", readInteractions);
router.patch("/interactions/:id/comment/user/:userId", patchComment);
router.delete("/interactions/:id/user/userId/:userId", deleteInteraction);

// Admin only
router.put("/admin/interactions/:id", updateInteraction);

export default router;