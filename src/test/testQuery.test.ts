import { executeRawQuery } from "../repositories/TestRepository";

async function run() {
    console.log("🚀 Avvio test query SQL...\n");


    const myQuery = `
        SELECT 
            p.id, 
            p.title, 
            COUNT(i.id) as total_interactions
        FROM posts p
        LEFT JOIN interactions i ON p.id = i.post_id
        GROUP BY p.id
    `;

    try {
        const result = await executeRawQuery(myQuery);
        
        if (Array.isArray(result) && result.length > 0) {
            console.table(result);
        } else {
            console.log("⚠️ La query non ha restituito risultati.");
        }
    } catch (err) {
        // L'errore è già gestito nel repository
    } finally {
        process.exit(); // Chiude la connessione al DB e termina
    }
}

run();