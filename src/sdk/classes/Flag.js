import { Segment } from "./Segment";

export class Flag {
  constructor({ f_key, is_active, created_at, updated_at, segments }) {
    this.f_key = f_key;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.segments = [];
    if (segments && segments.length !== 0) {
      segments.forEach((segment) => {
        this.segments.push(new Segment(segment));
      });
    }
  }

  evaluateFlag(userContext = {}) {
    return this.is_active && this.isUserInASegment(userContext);
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
