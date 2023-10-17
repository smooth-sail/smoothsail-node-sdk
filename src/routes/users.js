import { Router } from "express";
import { delay } from "../utils";

const router = Router();

const flags = {
  useRealUserData: false,
  bugFixed: false,
};

const realUsers = [
  { id: 1, lastName: "Smith", firstName: "John", age: 30 },
  { id: 2, lastName: "Johnson", firstName: "Emily", age: 28 },
  { id: 3, lastName: "Brown", firstName: "Michael", age: 35 },
  { id: 4, lastName: "Williams", firstName: "Sarah", age: 25 },
  { id: 5, lastName: "Jones", firstName: "Daniel", age: 32 },
  { id: 6, lastName: "Davis", firstName: "Olivia", age: 29 },
  { id: 7, lastName: "Miller", firstName: "Matthew", age: 33 },
  { id: 8, lastName: "Garcia", firstName: "Sophia", age: 27 },
  { id: 9, lastName: "Martinez", firstName: "Ethan", age: 31 },
];

const testUsers = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

router.get("/", async (req, res) => {
  if (!flags.bugFixed) {
    await delay(2000);
  } else {
    await delay(0);
  }

  if (flags.useRealUserData) {
    res.json(realUsers);
  } else {
    res.json(testUsers);
  }
});

// Toggle user data in CLI to test function of flags
// curl -X POST 'http://localhost:3001/users/toggle?flagName=useRealUserData'
// curl -X POST 'http://localhost:3001/users/toggle?flagName=bugFixed'
router.post("/toggle", (req, res) => {
  const flagName = req.query.flagName;
  flags[flagName] = !flags[flagName];
  res.send(`Toggled ${flagName} to ${flags[flagName]}`);
});

export default router;