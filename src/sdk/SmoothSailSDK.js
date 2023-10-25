import "dotenv/config";
import axios from "axios";
import EventSource from "eventsource";
import TEST_FLAGS from "../data/testFlags";

const GET_ALL_FLAGS = "http://localhost:3000/api/flags";

export class SDKClient {
  constructor() {
    this.flagData = {};
    this.fetchFeatureFlags();
    this.openSSEConnection();
  }

  async fetchFeatureFlags() {
    try {
      // const { data } = await axios.get(GET_ALL_FLAGS);

      this.flagData = TEST_FLAGS.payload;
    } catch (error) {
      throw error;
    }
  }

  evaluateFlag(flagKey, userContext) {
    const flag = this.flagData[flagKey];
    const userInSegment = this.isUserInSegment(flag, userContext);

    return flag && flag.is_active && userInSegment;
  }

  isUserInSegment(flag, userContext) {
    const segments = flag.segments;
    if (!segments || segments.length === 0) {
      return true;
    }
    // check if user context evals to true for any associated segment
    for (let segment of segments) {
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

  addNewFlag(flag) {
    this.flagData[flag["f_key"]] = flag;
  }

  updateFlag(updatedFlag) {
    this.flagData[updatedFlag["f_key"]] = updatedFlag;
  }

  deleteFlag(deletedFlag) {
    delete this.flagData[deletedFlag["f_key"]];
  }

  openSSEConnection() {
    const eventSource = new EventSource(process.env.SSE_ENDPOINT);

    eventSource.onopen = () => {
      console.log(`connection to ${process.env.SSE_ENDPOINT} opened!`);
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);

      switch (notification.type) {
        case "new-flag":
          this.addNewFlag(notification.payload);
          break;
        case "update":
          this.updateFlag(notification.payload);
          break;
        case "deleted-flag":
          this.deleteFlag(notification.payload);
          break;
      }

      console.log(this.flagData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };
  }
}
