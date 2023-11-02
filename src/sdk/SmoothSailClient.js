import "dotenv/config";
import EventSource from "eventsource";
import { Flag } from "./classes/Flag";

export class SmoothSailClient {
  constructor(config) {
    this.flagData = {};
    this.config = config;
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
      console.log(notification);
      if (notification.type === "flags") {
        console.log(notification);
        this.setFlags(notification);
      } else if (notification.type === "close") {
        eventSource.close();
      }
    };

    eventSource.onerror = (error) => {
      console.log(eventSource.readyState);
      console.error("SSE error:", error);

      if (error.status === 401) {
        console.log("get outta here");
      }
    };

    // eventSource.addEventListener("close", () => {
    //   eventSource.close();
    // });
  }
}
