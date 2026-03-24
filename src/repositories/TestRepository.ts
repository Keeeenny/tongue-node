//File only for testing purposes, not used in production

import dbPool from "../database/connection";

export const executeRawQuery = async (sql: string, params: any[] = []) => {
  try {
    const [rows] = await dbPool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error("❌ Errore SQL:", (error as Error).message);
    throw error;
  }
};
