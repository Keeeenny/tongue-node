import { Request, Response } from "express";
import { parseId, isNonEmptyString } from "../utils/validation";
import { ID, Interaction, InteractionType } from "../utils/types";
import { interactionRepository } from "../repositories/InteractionRepository";
import { sendResponse, handleError } from "../utils/responses";

//Create
export const createInteraction = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const user_id: ID = parseId(req.params.userId as string);
    const post_id: ID = parseId(req.params.postId as string);
    const { type, content } = req.body as {
      type: InteractionType;
      content?: string;
    };

    if (!user_id || !post_id) {
      return sendResponse(res, 400, "User ID and Post ID are required.");
    }

    if (type === InteractionType.COMMENT && !isNonEmptyString(content)) {
      return sendResponse(res, 400, "Comment content cannot be empty.");
    }

    if (type === "like") {
      const alreadyLiked = await interactionRepository.findInteraction(user_id, post_id, "like");
      if (alreadyLiked) {
        return sendResponse(res, 409, "Like already exists for this user and post.");
      }
    }

    const interactionId = await interactionRepository.insertInteraction(
      user_id,
      post_id,
      type,
      content,
    );

    if (!interactionId) throw new Error("Insertion failed.");

    return sendResponse(res, 201, "Interaction created successfully.", {
      id: interactionId,
    });
  } catch (error: unknown) {
    return handleError(res, error, "Unable to create the interaction.");
  }
};

//READ
export const readInteractions = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const interactions: Interaction[] = await interactionRepository.getAll();

    return sendResponse(
      res,
      200,
      "Interactions retrieved successfully.",
      interactions,
    );
  } catch (error: unknown) {
    return handleError(res, error, "Interactions not found.", 500);
  }
};

//UPDATE ALL ADMIN ONLY
export const updateInteraction = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);

    if (id === null) {
      return sendResponse(res, 400, "Not valid ID.");
    }

    const { user_id, post_id, type, content } = req.body as {
      user_id: ID;
      post_id: ID;
      type: InteractionType;
      content?: string;
    };

    if (!user_id || !post_id) {
      return sendResponse(res, 400, "User ID and Post ID are required.");
    }

    if (type === InteractionType.COMMENT && !isNonEmptyString(content)) {
      return sendResponse(res, 400, "Comment content cannot be empty.");
    }

    const findInteraction = await interactionRepository.findById(id);
    if (!findInteraction) {
      return sendResponse(res, 404, "Interaction not found.");
    }

    const isUpdated = await interactionRepository.updateAll(
      id,
      user_id,
      post_id,
      type,
      content,
    );

    if (!isUpdated) {
      return sendResponse(res, 200, "No changes made.");
    }

    return sendResponse(res, 200, "Interaction updated successfully.");
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

//PATCH COMMENT
export const patchComment = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);
    const user_id: ID = parseId(req.params.userId as string);

    if (id === null || user_id === null) {
      return sendResponse(res, 400, "Not valid ID.");
    }

    const { type, content } = req.body as {
      type: InteractionType.COMMENT;
      content: string;
    };

    if (type !== InteractionType.COMMENT) {
      return sendResponse(res, 400, "Only comments can be patched.");
    }

    if (!isNonEmptyString(content)) {
      return sendResponse(res, 400, "Comment content cannot be empty.");
    }

    const exists = await interactionRepository.findById(id);
    if (!exists)
      return sendResponse(res, 404, "Comment not found in database.");

    const isUpdated = await interactionRepository.updateCommentContent(
      id,
      user_id,
      content,
    );

    if (!isUpdated) {
      return sendResponse(
        res,
        403,
        "You are not authorized to edit this comment.",
      );
    }

    return sendResponse(res, 200, "Updated successfully.");
  } catch (error) {
    return handleError(res, error, "Internal Server Error");
  }
};

//DELETE
export const deleteInteraction = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);
    const user_id: ID = parseId(req.params.userId as string);

    if (id === null) {
      return sendResponse(res, 400, "Not valid ID.");
    }

    if (!user_id) {
      return sendResponse(
        res,
        400,
        "User ID is required to delete this interaction.",
      );
    }

    const deleteInteraction = await interactionRepository.removeInteraction(
      id,
      user_id,
    );

    if (!deleteInteraction) {
      return sendResponse(res, 404, "Interaction not found or unauthorized.");
    }

    return sendResponse(res, 200, "Interaction has been deleted.");
  } catch (error) {
    return handleError(res, error, "Unable to delete the Interaction");
  }
};
