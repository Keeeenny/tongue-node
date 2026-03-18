import { BaseRepository } from "./BaseRepository";
import { ResultSetHeader } from "mysql2";
import { ID, Post } from "../utils/types";
import dbPool from "../database/connection";

class PostRepository extends BaseRepository<Post> {
  protected tableName = "posts";

  //Create
  async insertPost(
    title: string,
    content: string,
    user_id: ID,
  ): Promise<number | boolean> {
    const sql = "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)";
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      title,
      content,
      user_id,
    ]);

    if (result.affectedRows === 0) return false;
    return result.insertId;
  }

  //Update
  async updatePost(
    id: ID,
    title: string,
    content: string,
    user_id: ID,
  ): Promise<boolean> {
    const sql = "UPDATE posts SET title = ?, content = ? WHERE id = ? AND user_id = ?";

    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      title,
      content,
      id,
      user_id,
    ]);

    return result.affectedRows > 0;
  }

  //Patch
  async patchPost(
    fieldsToUpdate: Array<string>,
    values: Array<any>,
    id: ID, 
    user_id: ID,
  ): Promise<boolean> {
    const sql = `UPDATE posts SET ${fieldsToUpdate.join(", ")} WHERE id = ? AND user_id = ?`;
    const finalValues = [...values, id, user_id];
    const [result] = await dbPool.execute<ResultSetHeader>(sql, finalValues);

    return result.affectedRows > 0;
  }

  //Delete
  async deletePost(id: ID, user_id: ID): Promise<boolean> {
    const sql = "DELETE FROM posts WHERE id = ? AND user_id = ?";
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [id, user_id]);

    return result.affectedRows > 0;
  }
}

export const postRepository = new PostRepository();


