import getSuccessors, {
  isMountainPass,
  validX,
  validY,
  isRailroad,
  isValidDestination,
  notRailroadSuccessors,
} from "./getSuccessors";

test("[1, 6] should be a mountain pass", () =>
  expect(isMountainPass(1, 6)).toBe(true));
test("[3, 6] should be a mountain pass", () =>
  expect(isMountainPass(3, 6)).toBe(true));
test("[1, 1] should not be a mountain pass", () =>
  expect(isMountainPass(1, 1)).toBe(false));

test("-1 should not be a valid y value", () => expect(validY(-1)).toBe(false));
test("0 should be a valid y value", () => expect(validY(0)).toBe(true));
test("5 should be a valid y value", () => expect(validY(5)).toBe(true));
test("12 should be a valid y value", () => expect(validY(12)).toBe(true));
test("13 should not be a valid y value", () => expect(validY(13)).toBe(false));

test("-1 should not be a valid x value", () => expect(validX(-1)).toBe(false));
test("0 should be a valid x value", () => expect(validX(0)).toBe(true));
test("4 should be a valid x value", () => expect(validX(4)).toBe(true));
test("5 should not be a valid x value", () => expect(validX(5)).toBe(false));
