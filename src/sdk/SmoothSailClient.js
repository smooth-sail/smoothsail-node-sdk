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
    let heartBeatInterval;
    const eventSource = new EventSource(`${this.config.serverAddress}`, {
      headers: {
        Authorization: `${this.config.sdkKey}`,
      },
    });

    eventSource.onopen = () => {
      console.log(`connection to ${process.env.SSE_ENDPOINT} opened!`);
      this.SSEconnected = true;
      heartBeatInterval = setTimeout(() => {
        eventSource.close();
        this.openSSEConnection();
      }, 15000);
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      console.log(notification);

      if (notification.type === "flags") {
        this.setFlags(notification.payload);
      } else if (notification.type === "heartbeat") {
        clearTimeout(heartBeatInterval);
        heartBeatInterval = setTimeout(() => {
          eventSource.close();
          this.openSSEConnection();
        }, 15000);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);

      if (error.status === 401) {
        console.log("get outta here");
      } else {
        eventSource.close();
        this.openSSEConnection();
      }

      this.SSEconnected = false;
    };
  }
}
