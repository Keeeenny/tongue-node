import dbPool from "../database/connection";

export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  async findById(id: number): Promise<T | undefined> {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [rows]: any = await dbPool.execute(sql, [id]);

    return rows[0] as T | undefined;
  }

  async findByField(field: string, value: any): Promise<T | undefined> {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${field} = ?`;
    const [rows]: any = await dbPool.execute(sql, [value]);
    return rows[0] as T | undefined;
  }

  async getAll(): Promise<T[]> {
    const sql = `SELECT * FROM ${this.tableName}`;
    const [rows]: any = await dbPool.execute(sql);
    return rows as T[];
  }
}
