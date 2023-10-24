const TEST_FLAGS = {
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
          ],
        },
      ],
    },
  },
};

export default TEST_FLAGS;
