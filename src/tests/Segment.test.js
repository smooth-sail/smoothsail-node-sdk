import { Segment } from "../classes/Segment";

const segments = {
  segmentWithAllRulesMustBeTrue: {
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
  segmentWithAnyRulesMustBeTrue: {
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
};

const userInInternalTestersSegment = {
  "beta-tester": true,
  email: "john_doe@gmail.com",
};

const userNotInInternalTestersSegment = {
  "beta-tester": true,
  email: "john_doe@coolcompany.com",
};

const userInPNWMillenialsSegment = {
  age: 25,
  state: "WA",
};

const userNotInPNWMillenialsSegment = {
  age: 25,
  state: "GA",
};

describe("segment evaluation", () => {
  test("segment is true if all rules are true", () => {
    let segment = new Segment(segments["segmentWithAllRulesMustBeTrue"]);
    expect(segment.evaluateSegment(userInInternalTestersSegment)).toBe(true);
  });

  test("segment is false if not all rules are true", () => {
    let segment = new Segment(segments["segmentWithAllRulesMustBeTrue"]);
    expect(segment.evaluateSegment(userNotInInternalTestersSegment)).toBe(
      false
    );
  });

  test("segment is true if any rule is true", () => {
    let segment = new Segment(segments["segmentWithAnyRulesMustBeTrue"]);
    expect(segment.evaluateSegment(userInPNWMillenialsSegment)).toBe(true);
  });

  test("segment is false if no rule is true", () => {
    let segment = new Segment(segments["segmentWithAnyRulesMustBeTrue"]);
    expect(segment.evaluateSegment(userNotInPNWMillenialsSegment)).toBe(false);
  });
});
