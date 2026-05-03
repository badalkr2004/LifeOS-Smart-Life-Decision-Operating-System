import "dotenv/config";
import { createApp } from "./app";
import { startScheduler } from "./ai/scheduler";

const PORT = process.env.PORT || 3000;

const startServer = () => {
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);

    // Start background intelligence jobs
    startScheduler();
  });
};

startServer();
