import dbPool from "../database/connection";
import { createResponseMock } from "./helpers/test.utils";

describe.only("🧪 SQL Sandbox - Query", function () {
  
  it("Esecuzione Query Grezza", async function () {

    const myQuery = `
        SELECT 
            *
        FROM posts;
    `;


    try {
        const [rows] = await dbPool.execute(myQuery);
        
        console.log("\n📊 DATABASE:");
        if (Array.isArray(rows) && rows.length > 0) {
            console.table(rows);
        } else {
            console.log("⚠️ Something went wrong.");
        }
    } catch (error) {
        console.error("❌ ERROR SQL:", (error as Error).message);
    }
  });

});