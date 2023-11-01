import "dotenv/config";
import EventSource from "eventsource";
// import { TEST_FLAG_1 } from "../data/testFlags";
import { Flag } from "./classes/Flag";

const GET_ALL_FLAGS = "http://localhost:3001/api/flags";

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
      const response = await fetch(GET_ALL_FLAGS);
      const data = await response.json();
      this.setFlags(data.payload);
      console.log("flag data", this.flagData);

      // with test data
      // this.setFlags(TEST_FLAG_1.payload);
    } catch (error) {
      throw error;
    }
  }

  setFlags(flags) {
    this.flagData = {};
    for (let flag in flags) {
      this.flagData[flag] = new Flag(flags[flag]);
    }
  }

  evaluateFlag(flagKey, userContext) {
    const flag = this.flagData[flagKey];
    return flag && flag.evaluateFlag(userContext);
  }

  updatedLastUpdated() {
    // is this still needed?
  }

  openSSEConnection() {
    const eventSource = new EventSource(process.env.SSE_ENDPOINT);

    eventSource.onopen = () => {
      console.log(`connection to ${process.env.SSE_ENDPOINT} opened!`);
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);

      if (notification.type === "flags") {
        console.log(notification);
        this.setFlags(notification);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };
  }
}
