import { BaseRepository } from "./BaseRepository";
import { ResultSetHeader } from "mysql2";
import { Interaction, ID, InteractionType } from "../utils/types";
import dbPool from "../database/connection";

class InteractionRepository extends BaseRepository<Interaction> {
  protected tableName = "interactions";

  // Create
  async insertInteraction(
    userId: ID,
    postId: ID,
    type: InteractionType,
    content?: string,
  ): Promise<number | boolean> {
    const sql =
      "INSERT INTO interactions (user_id, post_id, type, content) VALUES (?, ?, ?, ?)";
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      userId,
      postId,
      type,
      content !== undefined ? content : null,
    ]);

    if (result.affectedRows === 0) return false;
    return result.insertId;
  }

  // Update all admin only
  async updateAll(
    id: ID,
    userId: ID,
    postId: ID,
    type: InteractionType,
    content?: string,
  ): Promise<number | boolean> {
    const sql =
      "UPDATE interactions SET user_id = ?, post_id = ?, type = ?, content = ? WHERE id = ?";

    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      userId,
      postId,
      type,
      content !== undefined ? content : null,
      id,
    ]);

    if (result.affectedRows === 0) return false;
    return result.affectedRows > 0;
  }

  // Update comment
  async updateCommentContent(
    id: number,
    userId: ID,
    content: string,
  ): Promise<number | boolean> {
    const sql =
      "UPDATE interactions SET content = ? WHERE id = ? AND type = 'comment' AND user_id = ?";
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      content,
      id,
      userId,
    ]);

    if (result.affectedRows === 0) return false;
    return result.affectedRows > 0;
  }

  async removeInteraction(id: ID, userId: ID): Promise<boolean> {
    const sql = "DELETE FROM interactions WHERE id = ? AND user_id = ?";
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [id, userId]);

    return result.affectedRows > 0;
  }

  async findInteraction(userId: ID, postId: ID, type: 'like' | 'comment'): Promise<any | undefined> {
    const sql = `SELECT * FROM interactions WHERE user_id = ? AND post_id = ? AND type = ? LIMIT 1`;
    const [rows]: any = await dbPool.execute(sql, [userId, postId, type]);
    return rows[0];
  }
}

export const interactionRepository = new InteractionRepository();
