export { createHttpApp, findAvailablePort, startServer } from "./app";
import { startServer } from "./app";

startServer().catch(console.error);
