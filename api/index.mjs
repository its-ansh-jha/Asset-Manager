// Vercel serverless entry point for the database-backed Express API.
// The API bundle is produced before the client build by vercel.json.
import app from "../artifacts/api-server/dist/app.mjs";

export default app;
