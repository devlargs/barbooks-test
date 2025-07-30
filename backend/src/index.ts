import server from "./server";
import { config } from "./config/env";

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
  console.log(`Database path: ${config.DB_PATH}`);
});
