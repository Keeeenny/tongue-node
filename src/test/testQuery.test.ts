import dbPool from "../database/connection";

describe.only("🧪 SQL Sandbox - Query", function () {
  it("Query", async function () {
    const myQuery = `

SELECT posts.*, 
COUNT(CASE WHEN filtered_interactions.type = 'like' THEN 1 END) AS like_interactions, 
COUNT(CASE WHEN filtered_interactions.type = 'comment' THEN 1 END) AS comment_interactions 
FROM posts
LEFT JOIN (
  SELECT interactions.*
  FROM interactions
  INNER JOIN users ON users.id = interactions.user_id
  WHERE users.city = 'Thal'
  AND interactions.created_at <= '2026-03-21 23:00:00'
) AS filtered_interactions ON posts.id = filtered_interactions.post_id
WHERE posts.published_at <= '2026-03-29 23:00:00'
GROUP BY posts.id

    `;

    try {
      const [rows] = await dbPool.execute(myQuery);

      console.log("\n📊 DATABASE:");
      if (Array.isArray(rows) && rows.length > 0) {
        console.table(rows);
      } else {
        console.log("Array is empty.");
      }
    } catch (error) {
      console.error("❌ ERROR SQL:", (error as Error).message);
    }
  });
});


// SELECT posts.*, 
// COUNT(CASE WHEN filtered_interactions.type = 'like' THEN 1 END) AS like_interactions, 
// COUNT(CASE WHEN filtered_interactions.type = 'comment' THEN 1 END) AS comment_interactions 
// FROM posts
// LEFT JOIN (
//   SELECT interactions.*
//   FROM interactions
//   INNER JOIN users ON users.id = interactions.user_id
//   WHERE users.city = 'Thal'
//   AND interactions.created_at <= '2026-03-21 23:00:00'
// ) AS filtered_interactions ON posts.id = filtered_interactions.post_id
// WHERE posts.published_at <= '2026-03-29 23:00:00'
// GROUP BY posts.id