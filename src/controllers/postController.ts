import { Request, Response } from "express";
import { parseId, isNonEmptyString } from "../utils/validation";
import { Post, ID, PatchPostBody, UpdatePostBody } from "../utils/types";
import { postRepository } from "../repositories/PostRepository";
import { userRepository } from "../repositories/UserRepository";
import { handleError, sendResponse } from "../utils/responses";

// CREATE
export const createPost = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const user_id: ID = parseId(req.params.userId as string);
    const { title, content } = req.body;

    if (!user_id || !isNonEmptyString(title) || !isNonEmptyString(content)) {
      return sendResponse(res, 400, "All fields are mandatory.");
    }

    const author = await userRepository.findById(user_id);
    if (!author) {
      return sendResponse(res, 404, "User not found in database.");
    }

    const newPostId = await postRepository.insertPost(title, content, user_id);
    if (!newPostId) throw new Error("Insertion failed.");

    return sendResponse(res, 201, "Post created successfully.", {
      id: newPostId,
    });
  } catch (error) {
    return handleError(res, error, "Unable to create the post.");
  }
};

// READ
export const readPosts = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const posts: Post[] = await postRepository.getAll();

    return sendResponse(res, 200, "Posts retrieved successfully.", posts);
  } catch (error: unknown) {
    console.error("Database error:", error);
    return handleError(res, error, "Internal Error");
  }
};

// UPDATE
export const updatePost = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);
    const user_id: ID = parseId(req.params.userId as string);
    const { title, content } = req.body as UpdatePostBody;

    if (id === null || !title.trim() || !content.trim() || !user_id) {
      return sendResponse(
        res,
        400,
        "All fields are mandatory and ID must be valid.",
      );
    }

    const findPost = await postRepository.findById(id);
    if (!findPost) {
      return sendResponse(res, 404, "Post not found.");
    }

    if (findPost.user_id !== user_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to edit this post.",
      );
    }

    const isUpdated = await postRepository.updatePost(
      id,
      title,
      content,
      user_id,
    );

    if (!isUpdated) {
      return sendResponse(res, 200, "No changes detected.");
    }

    return sendResponse(res, 200, "Post updated.");
  } catch (error) {
    return handleError(res, error, "Internal server error.");
  }
};

// PATCH
export const patchPost = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);
    const user_id: ID = parseId(req.params.userId as string);
    const { title, content } = req.body as PatchPostBody;

    if (!id || !user_id) {
      return sendResponse(res, 400, "Invalid ID or User ID.");
    }

    const findPost = await postRepository.findById(id);
    if (!findPost) return sendResponse(res, 404, "Post not found.");

    if (findPost.user_id !== user_id) {
      return sendResponse(
        res,
        403,
        "You are not authorized to edit this post.",
      );
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (title && title.trim()) {
      updates.push("title = ?");
      values.push(title);
    }

    if (content && content.trim()) {
      updates.push("content = ?");
      values.push(content);
    }

    if (updates.length === 0) {
      return sendResponse(res, 400, "No fields provided.");
    }

    const isPatched = await postRepository.patchPost(
      updates,
      values,
      id,
      user_id,
    );

    if (!isPatched) {
      return sendResponse(res, 200, "No changes detected.");
    }

    return sendResponse(res, 200, "Post updated.");
  } catch (error) {
    return handleError(res, error, "Internal server error.");
  }
};

// DELETE
export const deletePost = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);
    const user_id: ID = parseId(req.params.userId as string);

    if (!id || !user_id) {
      return sendResponse(res, 400, "Post ID and User ID are required.");
    }

    const isDeleted = await postRepository.deletePost(id, user_id);

    if (!isDeleted) {
      return sendResponse(res, 404, "Post not found or unauthorized.");
    }

    return sendResponse(res, 200, "Post has been deleted.");
  } catch (error) {
    return handleError(res, error, "Internal server error.");
  }
};
