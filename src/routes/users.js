import { Router } from "express";
import { delay } from "../utils";
import { SDKClient } from "../sdk/SmoothSailSDK";
import { fetchUsersData, fetchTestUsersData } from "../services/users";
import { TEST_USER_CONTEXT_1 } from "../data/testUserContext";

const router = Router();

let client = new SDKClient();

router.get("/", async (req, res) => {
  // if (client.evaluateFlag("Bug fixed")) {
  //   await delay(0);
  // } else {
  //   await delay(2000);
  // }

  if (client.evaluateFlag("flag-1", TEST_USER_CONTEXT_1)) {
    res.json(fetchTestUsersData());
  } else {
    res.json(fetchUsersData());
  }
});

export default router;
