import { Rule } from "../classes/Rule";

const rules = {
  equalOperatorRule: {
    rKey: "bcd2",
    type: "boolean",
    operator: "=",
    value: true,
    aKey: "beta-tester",
  },
  isOperatorRule: {
    rKey: "bcd2",
    type: "boolean",
    operator: "is",
    value: true,
    aKey: "beta-tester",
  },
  isNotOperatorRule: {
    rKey: "bcd2",
    type: "boolean",
    operator: "is not",
    value: false,
    aKey: "beta-tester",
  },
  unequalOperatorRule: {
    rKey: "bcd2",
    type: "boolean",
    operator: "!=",
    value: false,
    aKey: "beta-tester",
  },
  containsOperatorRule: {
    rKey: "1abc",
    type: "string",
    operator: "contains",
    value: "@gmail.com",
    aKey: "email",
  },
  doesNotContainOperatorRule: {
    rKey: "1abc",
    type: "string",
    operator: "does not contain",
    value: "@gmail.com",
    aKey: "email",
  },
  greaterThanOperatorRule: {
    rKey: "97nd",
    type: "number",
    operator: ">=",
    value: 20,
    aKey: "age",
  },
  lessThanOperatorRule: {
    rKey: "97nd",
    type: "number",
    operator: "<=",
    value: 30,
    aKey: "age",
  },
  existsOperatorRule: {
    rKey: "97nd",
    type: "number",
    operator: "exists",
    value: true,
    aKey: "age",
  },
  doesNotExistOperatorRule: {
    rKey: "97nd",
    type: "number",
    operator: "does not exist",
    value: false,
    aKey: "age",
  },
};

const userContextBetaTester = {
  "beta-tester": true,
};

const userContextEmail = {
  email: "johndoe@gmail.com",
};

const userContextAge = {
  age: 25,
};

describe("rules evaluate correctly based on operator", () => {
  test("rule with equal (=) operator", () => {
    let rule = new Rule(rules["equalOperatorRule"]);
    expect(rule.isTrue(userContextBetaTester)).toBe(true);
  });

  test("rule with is operator", () => {
    let rule = new Rule(rules["isOperatorRule"]);
    expect(rule.isTrue(userContextBetaTester)).toBe(true);
  });

  test("rule with is not operator", () => {
    let rule = new Rule(rules["isNotOperatorRule"]);
    expect(rule.isTrue(userContextBetaTester)).toBe(true);
  });

  test("rule with unequal (!=) operator", () => {
    let rule = new Rule(rules["unequalOperatorRule"]);
    expect(rule.isTrue(userContextBetaTester)).toBe(true);
  });

  test("rule with contains operator", () => {
    let rule = new Rule(rules["containsOperatorRule"]);
    expect(rule.isTrue(userContextEmail)).toBe(true);
  });

  test("rule with does not contain operator", () => {
    let rule = new Rule(rules["doesNotContainOperatorRule"]);
    expect(rule.isTrue(userContextEmail)).toBe(false);
  });

  test("rule with greater than or equal to (>=) operator", () => {
    let rule = new Rule(rules["greaterThanOperatorRule"]);
    expect(rule.isTrue(userContextAge)).toBe(true);
  });

  test("rule with less than or equal to (<=) operator", () => {
    let rule = new Rule(rules["lessThanOperatorRule"]);
    expect(rule.isTrue(userContextAge)).toBe(true);
  });

  test("rule with exists operator", () => {
    let rule = new Rule(rules["existsOperatorRule"]);
    expect(rule.isTrue(userContextAge)).toBe(true);
  });

  test("rule with does not exist operator", () => {
    let rule = new Rule(rules["doesNotExistOperatorRule"]);
    expect(rule.isTrue(userContextAge)).toBe(false);
  });
});
