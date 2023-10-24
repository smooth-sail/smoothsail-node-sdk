import { Router } from "express";
import { delay } from "../utils";
import { SDKClient } from "../sdk/sdkClient";
import { fetchUsersData, fetchTestUsersData } from "../services/users";

const router = Router();

let client = new SDKClient();

router.get("/", async (req, res) => {
  if (client.evaluateFlag("Bug fixed")) {
    await delay(0);
  } else {
    await delay(2000);
  }

  if (client.evaluateFlag("Use test users")) {
    res.json(fetchTestUsersData());
  } else {
    res.json(fetchUsersData());
  }
});

export default router;
