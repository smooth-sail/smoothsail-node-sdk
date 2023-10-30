// test user in any segment evaluates to true
export const TEST_FLAG_1 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "bcd2",
              type: "boolean",
              operator: "=",
              value: true,
              a_key: "beta-tester",
            },
            {
              r_key: "1abc",
              type: "string",
              operator: "contains",
              value: "@gmail.com",
              a_key: "email",
            },
          ],
        },
        {
          s_key: "pnw-millenials",
          rules_operator: "any",
          rules: [
            {
              r_key: "97nd",
              type: "number",
              operator: ">=",
              value: 30,
              a_key: "age",
            },
            {
              r_key: "s10",
              type: "string",
              operator: "is",
              value: "WA",
              a_key: "state",
            },
          ],
        },
      ],
    },
  },
};

// test all rules operator - evaluates to true
export const TEST_FLAG_2 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "bcd2",
              type: "boolean",
              operator: "=",
              value: true,
              a_key: "beta-tester",
            },
            {
              r_key: "1abc",
              type: "string",
              operator: "contains",
              value: "@gmail.com",
              a_key: "email",
            },
          ],
        },
      ],
    },
  },
};

// test any rules operator - evaluates to true
export const TEST_FLAG_3 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "any",
          rules: [
            {
              r_key: "bcd2",
              type: "boolean",
              operator: "=",
              value: true,
              a_key: "beta-tester",
            },
            {
              r_key: "1abc",
              type: "string",
              operator: "contains",
              value: "@gmail.com",
              a_key: "email",
            },
          ],
        },
      ],
    },
  },
};

// test = rules operator - evaluates to true
export const TEST_FLAG_4 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "bcd2",
              type: "boolean",
              operator: "=",
              value: true,
              a_key: "beta-tester",
            },
          ],
        },
      ],
    },
  },
};

// test is rules operator - evaluates to true
export const TEST_FLAG_5 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "bcd2",
              type: "boolean",
              operator: "is",
              value: true,
              a_key: "beta-tester",
            },
          ],
        },
      ],
    },
  },
};

// test is not rules operator - evaluates to true
export const TEST_FLAG_6 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "bcd2",
              type: "boolean",
              operator: "is not",
              value: false,
              a_key: "beta-tester",
            },
          ],
        },
      ],
    },
  },
};

// test != rules operator - evaluates to true
export const TEST_FLAG_7 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "bcd2",
              type: "boolean",
              operator: "!=",
              value: false,
              a_key: "beta-tester",
            },
          ],
        },
      ],
    },
  },
};

// test contains rules operator - evaluates to true
export const TEST_FLAG_8 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "1abc",
              type: "string",
              operator: "contains",
              value: "@gmail.com",
              a_key: "email",
            },
          ],
        },
      ],
    },
  },
};

// test does not contain rules operator - evaluates to true
export const TEST_FLAG_9 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "1abc",
              type: "string",
              operator: "does not contain",
              value: "@gmail.com",
              a_key: "email",
            },
          ],
        },
      ],
    },
  },
};

// test >= rules operator - evaluates to true
export const TEST_FLAG_10 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "97nd",
              type: "number",
              operator: ">=",
              value: 30,
              a_key: "age",
            },
          ],
        },
      ],
    },
  },
};

// test <= rules operator - evaluates to true
export const TEST_FLAG_11 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "97nd",
              type: "number",
              operator: "<=",
              value: 30,
              a_key: "age",
            },
          ],
        },
      ],
    },
  },
};

// test exists rules operator - evaluates to true
export const TEST_FLAG_12 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "97nd",
              type: "number",
              operator: "exists",
              value: true,
              a_key: "age",
            },
          ],
        },
      ],
    },
  },
};

// test does not exist rules operator - evaluates to true
export const TEST_FLAG_13 = {
  payload: {
    "flag-1": {
      f_key: "flag-1",
      is_active: true,
      created_at: "2023-09-23 11:43:24.022579-07",
      updated_at: "2023-10-23 11:43:24.022579-07",
      segments: [
        {
          s_key: "internal-testers",
          rules_operator: "all",
          rules: [
            {
              r_key: "97nd",
              type: "number",
              operator: "does not exist",
              value: false,
              a_key: "age",
            },
          ],
        },
      ],
    },
  },
};
