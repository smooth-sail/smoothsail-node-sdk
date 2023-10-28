import "dotenv/config";
import axios from "axios";
import EventSource from "eventsource";
import TEST_FLAGS from "../data/testFlags";
import { Flag } from "./classes/Flag";

const GET_ALL_FLAGS = "http://localhost:3000/api/sdk/flags";

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
      const { data } = await axios.get(GET_ALL_FLAGS);
      for (let flag in data.payload) {
        this.flagData[flag] = new Flag(data.payload[flag]);
      }
      // console.log("flag data", this.flagData);

      // with test data
      // let featureFlags = TEST_FLAGS.payload;
      // for (let flag in featureFlags) {
      //   this.flagData[flag] = new Flag(featureFlags[flag]);
      //   console.log(this.flagData);
      // }
    } catch (error) {
      throw error;
    }
  }

  evaluateFlag(flagKey, userContext) {
    const flag = this.flagData[flagKey];
    return flag && flag.evaluateFlag(userContext);
  }

  addNewFlag(flag) {
    this.flagData[flag["f_key"]] = new Flag(flag);
  }

  updateFlag(updatedFlag) {
    let flag = this.flagData[updatedFlag["f_key"]];
    flag.updateFlag(updatedFlag);
  }

  deleteFlag(deletedFlagKey) {
    delete this.flagData[deletedFlagKey];
  }

  addSegment(newSegment) {
    let flagKey = newSegment["f_key"];
    let flag = this.flagData[flagKey];
    flag.addSegment(newSegment["segment"]);
  }

  removeSegment(deleteSegment) {
    let flagKey = deleteSegment["f_key"];
    let flag = this.flagData[flagKey];
    flag.removeSegment(deleteSegment["s_key"]);
  }

  updateSegmentBody(updatedSegment) {
    for (let flag in this.flagData) {
      flag.updateSegmentBody(updatedSegment);
    }
  }

  addRule(newRule) {
    for (let flag in this.flagData) {
      flag.addRule(newRule);
    }
  }

  removeRule(removeRule) {
    for (flag in this.flagData) {
      flag.removeRule(removeRule);
    }
  }

  updateSegmentRule(updatedSegmentRule) {
    for (let flag in this.flagData) {
      flag.updateSegmentRule(updatedSegmentRule);
    }
  }

  updatedLastUpdated() {
    // update the last_updated
    // will this be sent with the flag data or
    // should this be to time now when SSE notification received?
  }

  openSSEConnection() {
    const eventSource = new EventSource(process.env.SSE_ENDPOINT);

    eventSource.onopen = () => {
      console.log(`connection to ${process.env.SSE_ENDPOINT} opened!`);
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      console.log(notification);

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
          this.updateSegmentBody(notification.payload);
          break;
        case "rule add":
          this.addRule(notification.payload);
          break;
        case "rule remove":
          this.removeRule(notification.payload);
          break;
        case "rule update":
          this.updateSegmentRule(notification.payload);
          break;
      }

      // console.log(this.flagData);
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };
  }
}
