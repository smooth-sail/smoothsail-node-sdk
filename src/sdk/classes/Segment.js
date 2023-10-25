export class Segment {
  constructor({ s_key, rules_operator, rules }) {
    this.s_key = s_key;
    this.rules_operator = rules_operator;
    this.rules = rules || [];
  }

  evaluateSegment(userContext) {
    let results = false;
    if (this.rules_operator === "all") {
      results = this.rules.every((rule) => {
        return this.isRuleTrue(rule, userContext);
      });
    } else if (segment.rules_operator === "any") {
      results = this.rules.some((rule) => {
        return this.isRuleTrue(rule, userContext);
      });
    }

    return results;
  }

  isRuleTrue(rule, userContext) {
    let userAttr = userContext[rule["a_key"]];
    let userValue = rule["value"];
    let operator = rule.operator;

    if (operator === "is" || operator === "=") {
      return userAttr === userValue;
    } else if (operator === "is not" || operator === "!=") {
      return userAttr !== userValue;
    } else if (operator === "contains") {
      const regex = new RegExp(userValue);
      return regex.test(userAttr);
    } else if (operator === "does not contain") {
      const regex = new RegExp(userValue);
      return !regex.test(userAttr);
    } else if (operator === ">=") {
      return userAttr >= userValue;
    } else if (operator === "<=") {
      return userAttr <= userValue;
    } else if (operator === "exists") {
      return !!userAttr;
    } else if (operator === "does not exist") {
      return !userAttr;
    }
    return false;
  }

  updateSegmentBody({ s_key, rules_operator, rules }) {
    this.s_key = s_key;
    this.rules_operator = rules_operator;
    this.rules = rules || [];
  }

  addRule({ r_key, operator, value, a_key }) {
    this.rules.push({
      r_key,
      operator,
      value,
      a_key,
    });
  }

  removeRule(removeRule) {
    let newRules = this.rules.filter(
      (rule) => rule["r_key"] !== removeRule["r_key"]
    );
    this.rules = newRules;
  }

  updateSegmentRule({ r_key, operator, value, a_key }) {
    let updatedRules = this.rules.map((rule) => {
      if (r_key === rule["r_key"]) {
        return { r_key, operator, value, a_key };
      } else {
        return rule;
      }
    });
    this.rules = updatedRules;
  }
}
