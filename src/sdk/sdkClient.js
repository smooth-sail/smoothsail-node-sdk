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
    console.log(flag);
    // Default to false if flag not found.
    return flag ? flag.is_active : false;
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
