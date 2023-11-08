const Segment = require("./Segment");

class Flag {
  constructor({ fKey, isActive, segments }) {
    this.fKey = fKey;
    this.isActive = isActive;
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

    return this.segments.some((segment) =>
      segment.evaluateSegment(userContext)
    );
  }
}

modules.exports = Flag;
