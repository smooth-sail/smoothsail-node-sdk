export class Rule {
  constructor({ rKey, type, operator, value, aKey }) {
    this.rKey = rKey;
    this.type = type;
    this.operator = operator;
    this.value = value;
    this.aKey = aKey;
  }

  isTrue(userContext) {
    const userAttr = userContext[this.aKey];
    const value = this.value;
    let regex;

    switch (this.operator) {
      case "is":
      case "=":
        return userAttr === value;
      case "is not":
      case "!=":
        return userAttr !== value;
      case "contains":
        regex = new RegExp(value);
        return regex.test(userAttr);
      case "does not contain":
        regex = new RegExp(value);
        return !regex.test(userAttr);
      case ">=":
        return userAttr >= value;
      case "<=":
        return userAttr <= value;
      case "exists":
        return !!userAttr;
      case "does not exist":
        return !userAttr;
      default:
        return false;
    }
  }
}
