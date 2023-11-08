import "dotenv/config";
import EventSource from "eventsource";
import { Flag } from "./classes/Flag";

export class SmoothSailClient {
  constructor(config) {
    this.flagData = {};
    this.config = config;
    this.SSEconnected = false;
    this.heartBeatCheck;
    this.timeDurationCheck = 15000;
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

  resetHeartBeatCheckForConnection(connection) {
    clearTimeout(this.heartBeatCheck);

    this.heartBeatCheck = setTimeout(() => {
      console.error(
        "SmoothSail Server Client: Connection failed. Reopening SSE Connection."
      );
      this.resetSSEConnection(connection);
    }, this.timeDurationCheck);
  }

  resetSSEConnection(connection) {
    clearTimeout(this.heartBeatCheck);
    connection.close();
    this.openSSEConnection();
  }

  openSSEConnection() {
    const eventSource = new EventSource(`${this.config.serverAddress}`, {
      headers: {
        Authorization: `${this.config.sdkKey}`,
      },
    });

    eventSource.onopen = () => {
      this.SSEconnected = true;
      this.resetHeartBeatCheckForConnection(eventSource);
    };

    eventSource.onmessage = (e) => {
      const notification = JSON.parse(e.data);

      switch (notification.type) {
        case "flags":
          this.setFlags(notification.payload);
          break;
        case "heartbeat":
          this.resetHeartBeatCheckForConnection(eventSource);
          break;
      }
    };

    eventSource.onerror = (error) => {
      this.SSEconnected = false;

      if (error.status === 401) {
        console.error("Invalid Credentials. Cannot establish connection.");
        eventSource.close();
      } else if (error.status === 404) {
        console.error("Invalid Server Address. Cannot establish connection.");
        eventSource.close();
      } else {
        console.error("SSE Error: ", error, " Attempting reconnection.");
      }
    };
  }
}
