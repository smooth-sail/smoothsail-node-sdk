import "dotenv/config";
import axios from "axios";
import EventSource from "eventsource";

export class SDKClient {
  constructor() {
    this.flagData = [];
  }

  fetchFeatureFlags = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/flags");
      this.flagData = data;
    } catch (error) {
      throw error;
    }
  };

  evaluateFlag(title) {
    const flag = this.flagData.find((flag) => flag.title === title);
    console.log(flag);
    return flag.is_active;
  }

  openSSEConnection() {
    const eventSource = new EventSource(process.env.SSE_ENDPOINT);

    eventSource.onopen = () => {
      console.log(`connection to ${process.env.SSE_ENDPOINT} opened!`);
    };

    eventSource.onmessage = (e) => {
      console.log(JSON.parse(e.data));
      // Can handle SSE notifications here.
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };
  }
}
