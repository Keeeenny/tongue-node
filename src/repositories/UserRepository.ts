import { BaseRepository } from "./BaseRepository";
import { ResultSetHeader } from "mysql2";
import { User, ID } from "../utils/types";
import dbPool from "../database/connection";

class UserRepository extends BaseRepository<User> {
  protected tableName = "users";

  //Create
  async insertUser(
    nickname: string,
    age: number,
    city: string
  ): Promise<number | boolean> {
    const sql = "INSERT INTO users (nickname, age, city) VALUES (?, ?, ?)";
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      nickname,
      age,
      city,
    ]);

    if (result.affectedRows === 0) return false;
    return result.insertId;
  }

  //Update
  async updateUser(
    id: ID,
    nickname: string,
    age: number,
    city: string
  ): Promise<boolean> {
    const sql = "UPDATE users SET nickname = ?, age = ?, city = ? WHERE id = ?";

    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      nickname,
      age,
      city,
      id,
    ]);

    return result.affectedRows > 0;
  }

  //Patch
  async patchUser(
    id: ID,
    fieldsToUpdate: Array<string>,
    values: Array<any>
  ): Promise<boolean> {
    const sql = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [
      ...values,
      id,
    ]);

    return result.affectedRows > 0;
  }

  //Delete
  async deleteUser(id: ID): Promise<boolean> {
    const sql = "DELETE FROM users WHERE id = ?";
    const [result] = await dbPool.execute<ResultSetHeader>(sql, [id]);

    return result.affectedRows > 0
  }
}

export const userRepository = new UserRepository();
