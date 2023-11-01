import { Segment } from "./Segment";

export class Flag {
  constructor({ fKey, isActive, updatedAt, segments }) {
    this.fKey = fKey;
    this.isActive = isActive;
    this.updatedAt = updatedAt;
    this.segments = [];
    if (segments && segments.length !== 0) {
      segments.forEach((segment) => {
        this.segments.push(new Segment(segment));
      });
    }
  }

  evaluateFlag(userContext = {}) {
    return this.isActive && this.isUserInASegment(userContext);
  }

  isUserInASegment(userContext) {
    if (this.segments.length === 0) {
      return true;
    }

    // check if user context evals to true for any associated segment
    return this.segments.some((segment) =>
      segment.evaluateSegment(userContext)
    );
  }
}
