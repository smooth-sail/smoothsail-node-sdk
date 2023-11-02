import "dotenv/config";
import EventSource from "eventsource";
// import { TEST_FLAG_1 } from "../data/testFlags";
import { Flag } from "./classes/Flag";

export class SmoothSailClient {
  constructor(config) {
    this.flagData = {};
    this.config = config;
  }

  async fetchFeatureFlags() {
    try {
      const response = await fetch(this.config.developmentAddress, {
        // headers: new Headers({
        //   "ngrok-skip-browser-warning": "485737",
        // }),
      });
      const data = await response.json();
      this.setFlags(data.payload);
      console.log("flag data", this.flagData);
    } catch (error) {
      // double check
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

  openSSEConnection() {
    // sdkKey used as event type?
    const eventSource = new EventSource(
      `${this.config.serverAddress}?key=${this.config.sdkKey}`
    );

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
