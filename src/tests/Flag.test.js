import { Flag } from "../classes/Flag";

const flags = {
  inactiveFlag: {
    fKey: "test-flag-1",
    isActive: false,
    segments: [],
  },
  flagWithInternalTestersAndPNWSegments: {
    fKey: "test-flag-2",
    isActive: true,
    segments: [
      {
        sKey: "internal-testers",
        rulesOperator: "all",
        rules: [
          {
            rKey: "bcd2",
            type: "boolean",
            operator: "=",
            value: true,
            aKey: "beta-tester",
          },
          {
            rKey: "1abc",
            type: "string",
            operator: "contains",
            value: "@gmail.com",
            aKey: "email",
          },
        ],
      },
      {
        sKey: "pnw-millenials",
        rulesOperator: "any",
        rules: [
          {
            rKey: "97nd",
            type: "number",
            operator: ">=",
            value: 30,
            aKey: "age",
          },
          {
            rKey: "s10",
            type: "string",
            operator: "is",
            value: "WA",
            aKey: "state",
          },
        ],
      },
    ],
  },
};

const userInPNWMillenialsOnly = {
  "beta-tester": true,
  email: "john_doe@coolcompany.com",
  age: 25,
  state: "WA",
};

const userInNotSegment = {
  "beta-tester": false,
  email: "john_doe@coolcompany.com",
  age: 25,
  state: "GA",
};

describe("flag evaluation", () => {
  test("inactive flag with no user context", () => {
    let flag = new Flag(flags["inactiveFlag"]);
    expect(flag.evaluateFlag()).toBe(false);
  });

  test("inactive flag with a user context", () => {
    let flag = new Flag(flags["inactiveFlag"]);
    expect(flag.evaluateFlag(userInPNWMillenialsOnly)).toBe(false);
  });

  test("active flag and user not in a segment", () => {
    let flag = new Flag(flags["flagWithInternalTestersAndPNWSegments"]);
    expect(flag.evaluateFlag(userInNotSegment)).toBe(false);
  });

  test("active flag and user in a segment", () => {
    let flag = new Flag(flags["flagWithInternalTestersAndPNWSegments"]);
    expect(flag.evaluateFlag(userInPNWMillenialsOnly)).toBe(true);
  });
});
