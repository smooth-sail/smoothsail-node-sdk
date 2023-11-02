import { Router } from "express";
import { fetchUsersData, fetchTestUsersData } from "../services/users";
import { TEST_USER_CONTEXT_1 } from "../data/testUserContext";
import { SmoothSailConfig } from "../sdk/SmoothSailConfig";

const router = Router();

let client;
const config = new SmoothSailConfig(
  process.env.SDK_KEY,
  process.env.SSE_ENDPOINT
);

(async () => {
  client = await config.connect();
})();

router.get("/", async (req, res) => {
  if (client.evaluateFlag("flag-1", TEST_USER_CONTEXT_1)) {
    res.json(fetchTestUsersData());
  } else {
    res.json(fetchUsersData());
  }
});

export default router;
