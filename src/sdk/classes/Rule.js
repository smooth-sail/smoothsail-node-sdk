export class Rule {
  constructor({ r_key, type, operator, value, a_key }) {
    this.r_key = r_key;
    this.type = type;
    this.operator = operator;
    this.value = value;
    this.a_key = a_key;
  }

  isTrue(userContext) {
    let userAttr = userContext[this.a_key];

    if (this.operator === "is" || this.operator === "=") {
      return userAttr === this.value;
    } else if (this.operator === "is not" || this.operator === "!=") {
      return userAttr !== this.value;
    } else if (this.operator === "contains") {
      const regex = new RegExp(this.value);
      return regex.test(userAttr);
    } else if (this.operator === "does not contain") {
      const regex = new RegExp(this.value);
      return !regex.test(userAttr);
    } else if (this.operator === ">=") {
      return userAttr >= this.value;
    } else if (this.operator === "<=") {
      return userAttr <= this.value;
    } else if (this.operator === "exists") {
      return !!userAttr;
    } else if (this.operator === "does not exist") {
      return !userAttr;
    }
    return false;
  }
}
