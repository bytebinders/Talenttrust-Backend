import { TalentTrustApp } from "./app";
import { healthRouter } from "./health";
import { routerApp } from "./router";
import * as deploy from "./deploy";

const MODE = process.env.MODE || "app";
const COLOR = process.env.APP_COLOR || "blue";
const PORT =
  process.env.PORT ||
  (MODE === "router" ? 3000 : COLOR === "green" ? 3002 : 3001);

async function main() {
  switch (MODE) {
    case "router": {
      routerApp.listen(PORT, () => {
        console.log(`Router listening on http://localhost:${PORT}`);
      });
      break;
    }
    case "deploy": {
      const args = process.argv.slice(2);
      if (args[0] === "switch-green") {
        await deploy.switchToGreen();
      } else if (args[0] === "rollback") {
        await deploy.rollback();
      } else {
        const status = await deploy.getStatus();
        console.log("Deployment status:", status);
      }
      process.exit(0);
      break;
    }
    default: {
      // app mode
      const app = new TalentTrustApp();
      app.getApp().use("/health", healthRouter);
      app.getApp().listen(PORT, () => {
        console.log(
          `TalentTrust ${COLOR} app listening on http://localhost:${PORT}`,
        );
      });
      break;
    }
  }
}

main().catch(console.error);
