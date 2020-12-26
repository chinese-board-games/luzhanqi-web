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

const generateRow = y => [...Array(4).keys()].map(x => [x, y]);

const topRailCoords = generateRow(1);
test("[0, 1] to [4, 1] should be valid railroad coordinates", () =>
  expect(topRailCoords.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

const topMidRailCoords = generateRow(5);
test("[0, 5] to [4, 5] should be valid railroad coordinates", () =>
  expect(topMidRailCoords.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

const botMidRailCoords = generateRow(7);
test("[0, 7] to [4, 7] should be valid railroad coordinates", () =>
  expect(botMidRailCoords.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

const botRailCoords = generateRow(11);
test("[0, 11] to [4, 11] should be valid railroad coordinates", () =>
  expect(botRailCoords.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

const generateCol = x => [...Array(13).keys()].map(y => [x, y]);
const leftCol = generateCol(0).slice(1, -1);
test("[0, 1] to [0, 11] should be valid railroad coordinates", () =>
  expect(leftCol.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

const rightCol = generateCol(4).slice(1, -1);;
test("[4, 1] to [4, 11] should be valid railroad coordinates", () =>
  expect(rightCol.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

