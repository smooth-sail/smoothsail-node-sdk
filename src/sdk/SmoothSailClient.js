import "dotenv/config";
import EventSource from "eventsource";
import { Flag } from "./classes/Flag";

export class SmoothSailClient {
  constructor(config) {
    this.flagData = {};
    this.config = config;
    this.SSEconnected = false;
  }

  setFlags(flags) {
    this.flagData = {};
    for (let flag in flags) {
      this.flagData[flag] = new Flag(flags[flag]);
    }
  }

  evaluateFlag(flagKey, userContext, defaultValue = false) {
    const flag = this.flagData[flagKey];
    if (this.SSEconnected) {
      return flag && flag.evaluateFlag(userContext);
    } else {
      return defaultValue;
    }
  }

  openSSEConnection() {
    const eventSource = new EventSource(`${this.config.serverAddress}`, {
      headers: {
        Authorization: `${this.config.sdkKey}`,
      },
    });

    eventSource.onopen = () => {
      console.log(`connection to ${process.env.SSE_ENDPOINT} opened!`);
      this.SSEconnected = true;
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      console.log(notification);

      if (notification.type === "flags") {
        this.setFlags(notification);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);

      if (error.status === 401) {
        console.log("get outta here");
      }

      this.SSEconnected = false;
    };
  }
}
