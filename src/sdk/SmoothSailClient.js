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

  resetSSEConnection(connection) {
    connection.close();
    this.openSSEConnection();
  }

  startHeartBeatInterval(connection, timeDuration) {
    return setTimeout(() => {
      this.resetSSEConnection(connection);
    }, timeDuration);
  }

  openSSEConnection() {
    let heartBeatInterval;
    const eventSource = new EventSource(`${this.config.serverAddress}`, {
      headers: {
        Authorization: `${this.config.sdkKey}`,
      },
    });

    eventSource.onopen = () => {
      console.log(`Connection to ${process.env.SSE_ENDPOINT} opened!`);
      this.SSEconnected = true;
      heartBeatInterval = this.startHeartBeatInterval(eventSource, 15000);
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);
      console.log(notification);

      switch (notification.type) {
        case "flags":
          this.setFlags(notification.payload);
          break;
        case "heartbeat":
          clearTimeout(heartBeatInterval);
          heartBeatInterval = this.startHeartBeatInterval(eventSource, 15000);
          break;
      }
    };

    eventSource.onerror = (error) => {
      this.SSEconnected = false;

      if (error.status === 401) {
        console.error("Invalid Credentials");
      } else {
        console.error("Attempting reconnection. SSE Error: ", error);
        this.resetSSEConnection(eventSource);
      }
    };
  }
}
