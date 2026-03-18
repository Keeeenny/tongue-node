import { Request, Response } from "express";
import { parseId, isNonEmptyString, isValidNumber } from "../utils/validation";
import { User, ID } from "../utils/types";
import { userRepository } from "../repositories/UserRepository";
import { handleError, sendResponse } from "../utils/responses";

// CREATE
export const createUser = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { nickname, age, city } = req.body as {
      nickname: string;
      age: number;
      city: string;
    };

    if (!isValidNumber(age)) {
      return sendResponse(res, 400, "Age is required and must be a number.");
    }

    if (!isNonEmptyString(nickname) || !isNonEmptyString(city)) {
      return sendResponse(res, 400, "Nickname and city are mandatory.");
    }

    if (age <= 14) {
      return sendResponse(res, 400, "You must be older than 14 years old.");
    }

    if (age > 110) {
      return sendResponse(res, 400, "Please put a realistic age.");
    }

    const existingUser = await userRepository.findByField("nickname", nickname);
    if (existingUser) {
      return sendResponse(res, 409, "User already exists in database.");
    }

    const newUserId = await userRepository.insertUser(nickname, age, city);

    if (!newUserId) throw new Error("Insertion failed.");

    return sendResponse(res, 201, "User created successfully.", {
      id: newUserId,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// READ
export const readUsers = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const users: User[] = await userRepository.getAll();

    return sendResponse(res, 200, "Users retrieved successfully.", users);
  } catch (error) {
    return handleError(res, error);
  }
};

// UPDATE
export const updateUser = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);
    const { nickname, age, city } = req.body;

    if (id === null) {
      return sendResponse(res, 400, "Not valid ID.");
    }

    if (!isValidNumber(age)) {
      return sendResponse(res, 400, "Age is required and must be a number.");
    }

    if (!isNonEmptyString(nickname) || !isNonEmptyString(city)) {
      return sendResponse(res, 400, "Nickname and city are mandatory.");
    }

    if (age <= 14) {
      return sendResponse(res, 400, "You must be older than 14 years old.");
    }

    if (age > 110) {
      return sendResponse(res, 400, "Please put a realistic age.");
    }

    const findUser = await userRepository.findById(id);
    if (!findUser) {
      return sendResponse(res, 404, "User not found.");
    }

    const isUpdated = await userRepository.updateUser(id, nickname, age, city);

    if (!isUpdated) {
      return sendResponse(res, 200, "No changes detected");
    }

    return sendResponse(res, 200, "User updated successfully.");
  } catch (error) {
    return handleError(res, error, "Unable to update the user.");
  }
};

// PATCH
export const patchUser = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);
    if (id === null) {
      return sendResponse(res, 400, "Not valid ID.");
    }

    const findUser = await userRepository.findById(id);
    if (!findUser) {
      return sendResponse(res, 404, "User not found.");
    }

    const { nickname, age, city } = req.body;
    const updates: string[] = [];
    const values: any[] = [];

    if (nickname !== undefined) {
      if (!isNonEmptyString(nickname)) {
        return sendResponse(res, 400, "Nickname cannot be empty.");
      }
      updates.push("nickname = ?");
      values.push(nickname);
    }

    if (age !== undefined) {
      if (!isValidNumber(age)) {
        return sendResponse(res, 400, "Age must be a number.");
      }
      if (age <= 14) {
        return sendResponse(res, 400, "Age must be > 14.");
      }
      if (age > 110) {
        return sendResponse(res, 400, "Please put a realistic age.");
      }

      updates.push("age = ?");
      values.push(age);
    }

    if (city !== undefined) {
      if (!isNonEmptyString(city)) {
        return sendResponse(res, 400, "City cannot be empty.");
      }

      updates.push("city = ?");
      values.push(city);
    }

    if (updates.length === 0) {
      return sendResponse(res, 400, "No fields provided for update.");
    }

    const isPatched = await userRepository.patchUser(id, updates, values);

    if (!isPatched) {
      return sendResponse(res, 200, "No changes detected.");
    }

    return sendResponse(res, 200, "User updated successfully.");
  } catch (error) {
    handleError(res, error, "Unable to update the user.");
  }
};

// DELETE
export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const id: ID = parseId(req.params.id as string);

    if (id === null) {
      return sendResponse(res, 400, "Not valid ID");
    }

    const isDeleted = await userRepository.deleteUser(id);

    if (!isDeleted) {
      return sendResponse(res, 400, `User with ID ${id} not found.`);
    }

    return sendResponse(res, 200, "User has been deleted");
  } catch (error) {
    return handleError(res, error, "Unable to delete the user");
  }
};
