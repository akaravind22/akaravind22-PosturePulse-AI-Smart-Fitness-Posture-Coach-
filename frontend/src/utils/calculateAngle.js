/**
 * Calculates 2D angle in degrees at vertex pointB formed by line (pointA -> pointB) and (pointC -> pointB).
 * @param {{x: number, y: number}} pointA
 * @param {{x: number, y: number}} pointB - Vertex point (e.g. joint)
 * @param {{x: number, y: number}} pointC
 * @returns {number} Angle between 0 and 180 degrees
 */
export const calculateAngle = (pointA, pointB, pointC) => {
  if (!pointA || !pointB || !pointC) return 0;

  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);

  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360.0 - angle;
  }

  return Math.round(angle);
};

/**
 * Calculates angle relative to vertical line (used for back posture checking)
 */
export const calculateVerticalAngle = (pointA, pointB) => {
  if (!pointA || !pointB) return 0;

  const dy = pointB.y - pointA.y;
  const dx = pointB.x - pointA.x;

  const radians = Math.atan2(dx, dy);
  const angle = Math.abs((radians * 180.0) / Math.PI);

  return Math.round(angle);
};
