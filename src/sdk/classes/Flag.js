import { Segment } from "./Segment";

export class Flag {
  constructor({ fKey, isActive, createdAt, updatedAt, segments }) {
    this.fKey = fKey;
    this.isActive = isActive;
    this.createdAt = createdAt;
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
