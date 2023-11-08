const Rule = require("./Rule");

class Segment {
  constructor({ sKey, rulesOperator, rules }) {
    this.sKey = sKey;
    this.rulesOperator = rulesOperator;
    this.rules = [];
    if (rules && rules.length !== 0) {
      rules.forEach((rule) => {
        this.rules.push(new Rule(rule));
      });
    }
  }

  evaluateSegment(userContext) {
    if (this.rulesOperator === "all") {
      return this.rules.every((rule) => {
        return rule.isTrue(userContext);
      });
    } else if (this.rulesOperator === "any") {
      return this.rules.some((rule) => {
        return rule.isTrue(userContext);
      });
    }

    return false;
  }
}

module.exports = Segment;
