import getSuccessors, {
  isValidX,
  isValidY,
  isRailroad,
  isValidDestination,
  notRailroadSuccessors,
  placePiece,
} from "./getSuccessors";
import Piece from "./piece";

test("-1 should not be a valid x value", () => expect(isValidX(-1)).toBe(false));
test("0 should be a valid x value", () => expect(isValidX(0)).toBe(true));
test("4 should be a valid x value", () => expect(isValidX(4)).toBe(true));
test("5 should not be a valid x value", () => expect(isValidX(5)).toBe(false));

test("-1 should not be a valid y value", () => expect(isValidY(-1)).toBe(false));
test("0 should be a valid y value", () => expect(isValidY(0)).toBe(true));
test("5 should be a valid y value", () => expect(isValidY(5)).toBe(true));
test("11 should be a valid y value", () => expect(isValidY(11)).toBe(true));
test("12 should not be a valid y value", () => expect(isValidY(12)).toBe(false));

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

const botMidRailCoords = generateRow(6);
test("[0, 6] to [4, 6] should be valid railroad coordinates", () =>
  expect(botMidRailCoords.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

const botRailCoords = generateRow(10);
test("[0, 10] to [4, 10] should be valid railroad coordinates", () =>
  expect(botRailCoords.map(([x, y]) => isRailroad(x, y)).every((v) => v)).toBe(
    true
));

const generateCol = x => [...Array(12).keys()].map(y => [x, y]);

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

let board = Array(12).fill(Array(5).fill(null));

test('out of bound x move [-1, 5] should not be valid', () => (
  expect(isValidDestination(board, -1, 5, 0)).toBe(false)
));

test('out of bound y move [0, -1] should not be valid', () => (
  expect(isValidDestination(board, 0, -1, 0)).toBe(false)
));

board = placePiece(board, 0, 0, Piece('Marshal', 0));
test('[0, 0] should be an invalid destination for affiliation 0', () => (
  expect(isValidDestination(board, 0, 0, 0)).toBe(false)
));
test('[0, 0] should be a valid destination for affiliation 1', () => (
  expect(isValidDestination(board, 0, 0, 1)).toBe(true)
));
console.log(board)