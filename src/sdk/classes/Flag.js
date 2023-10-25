export class Flag {
  constructor({ f_key, is_active, created_at, updated_at, segments }) {
    this.f_key = f_key;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.segments = segments || [];
  }

  updateFlag({ f_key, is_active, created_at, updated_at, segments }) {
    this.f_key = f_key;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.segments = segments || [];
  }

  evaluateFlag(userContext = {}) {
    return this.is_active && this.isUserInSegment(userContext);
  }

  isUserInSegment(userContext) {
    if (this.segments.length === 0) {
      return true;
    }

    // check if user context evals to true for any associated segment
    for (let segment of this.segments) {
      if (this.evaluateRules(segment, userContext)) {
        return true;
      }
    }
    return false;
  }

  evaluateRules(segment, userContext) {
    let results = false;
    if (segment.rules_operator === "all") {
      results = segment.rules.every((rule) => {
        return this.isRuleTrue(rule, userContext);
      });
    } else if (segment.rules_operator === "any") {
      results = segment.rules.some((rule) => {
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

  addSegment(segment) {
    this.segments.push(segment);
  }

  removeSegment(segment) {
    let newSegments = this.segments.filter(
      (segment) => segment["s_key"] !== deleteSegment["s_key"]
    );
    this.segments = newSegments;
  }

  addRule(newRule) {
    let rule = {
      r_key: newRule["r_key"],
      operator: newRule["operator"],
      value: newRule["value"],
      a_key: newRule["a_key"],
    };
    this.segments.forEach((segment) => {
      if (segment.s_key === newRule["s_key"]) {
        segment.rules.push(rule);
      }
    });
  }

  removeRule(removeRule) {
    this.segments.forEach((segment) => {
      if (segment.s_key === removeRule["s_key"]) {
        let newRules = segment.rules.filter(
          (rule) => rule["r_key"] !== removeRule["r_key"]
        );
        segment.rules = newRules;
      }
    });
  }

  updateSegmentRule(updatedSegmentRule) {
    let updatedRuleForSegment = {
      r_key: updatedSegmentRule["r_key"],
      operator: updatedSegmentRule["operator"],
      value: updatedSegmentRule["value"],
      a_key: updatedSegmentRule["a_key"],
    };

    this.segments.forEach((segment) => {
      if (segment.s_key === updatedSegmentRule["s_key"]) {
        let updatedRules = segment.rules.map((rule) => {
          if (updatedSegmentRule["r_key"] === rule["r_key"]) {
            return updatedRuleForSegment;
          } else {
            return rule;
          }
        });
        segment.rules = updatedRules;
      }
    });
  }
}
