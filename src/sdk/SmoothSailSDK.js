import "dotenv/config";
import axios from "axios";
import EventSource from "eventsource";
import TEST_FLAGS from "../data/testFlags";

const GET_ALL_FLAGS = "http://localhost:3000/api/flags";

export class SDKClient {
  constructor() {
    this.flagData = {};
    this.last_updated;
    this.fetchFeatureFlags();
    this.openSSEConnection();
    this.updatedLastUpdated();
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

  deleteFlag(deletedFlagKey) {
    delete this.flagData[deletedFlagKey];
  }

  addSegment(newSegment) {
    this.flagData[newSegment["f_key"]]["segments"].push(newSegment["segment"]);
  }

  removeSegment(deleteSegment) {
    let segments = this.flagData[deleteSegment["f_key"]]["segments"];
    let newSegments = segments.filter(
      (segment) => segment["s_key"] !== deleteSegment["s_key"]
    );
    this.flagData[deleteSegment["f_key"]]["segments"] = newSegments;
  }

  updateSegment() {
    // segment body update ?
  }

  addRule(newRule) {
    let rule = {
      r_key: newRule["r_key"],
      operator: newRule["operator"],
      value: newRule["value"],
      a_key: newRule["a_key"],
    };
    for (flag in this.flagData) {
      flag.segments.forEach((segment) => {
        if (segment.s_key === newRule["s_key"]) {
          segment.rules.push(rule);
        }
      });
    }
  }

  removeRule(removeRule) {
    for (flag in this.flagData) {
      flag.segments.forEach((segment) => {
        if (segment.s_key === removeRule["s_key"]) {
          let newRules = segment.rules.filter(
            (rule) => rule["r_key"] !== removeRule["r_key"]
          );
          segment.rules = newRules;
        }
      });
    }
  }

  updateSegmentRule(updatedSegmentRule) {
    let updatedRuleForSegment = {
      r_key: updatedSegmentRule["r_key"],
      operator: updatedSegmentRule["operator"],
      value: updatedSegmentRule["value"],
      a_key: updatedSegmentRule["a_key"],
    };
    for (flag in this.flagData) {
      flag.segments.forEach((segment) => {
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

  updatedLastUpdated() {
    // update the last_updated
    // should this be to time now when SSE notification received?
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
        case "toggle":
          this.updateFlag(notification.payload);
          break;
        case "deleted-flag":
          this.deleteFlag(notification.payload);
          break;
        case "segment add":
          this.addSegment(notification.payload);
          break;
        case "segment remove":
          this.removeSegment(notification.payload);
          break;
        case "segment body update":
          this.updateSegment(notification.payload);
          break;
        case "rule add":
          this.addRule(notification.payload);
          break;
        case "rule remove":
          this.removeRule(notification.payload);
          break;
        case "segment update":
          this.updateSegmentRule(notification.payload);
          break;
      }

      console.log(this.flagData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };
  }
}
