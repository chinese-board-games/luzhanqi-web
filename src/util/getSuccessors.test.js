import getSuccessors, {
  isValidX,
  isValidY,
  isRailroad,
  isValidDestination,
  placePiece,
  generateAdjList,
  isCamp,
} from "./getSuccessors";
import Piece from "./piece";

// test x and y validation
test("-1 should not be a valid x value", () => expect(isValidX(-1)).toBe(false));
test("0 should be a valid x value", () => expect(isValidX(0)).toBe(true));
test("4 should be a valid x value", () => expect(isValidX(4)).toBe(true));
test("5 should not be a valid x value", () => expect(isValidX(5)).toBe(false));

test("-1 should not be a valid y value", () => expect(isValidY(-1)).toBe(false));
test("0 should be a valid y value", () => expect(isValidY(0)).toBe(true));
test("5 should be a valid y value", () => expect(isValidY(5)).toBe(true));
test("11 should be a valid y value", () => expect(isValidY(11)).toBe(true));
test("12 should not be a valid y value", () => expect(isValidY(12)).toBe(false));

// test isRailroad
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

// test isValidDestination
let board = [];
for (let i = 0; i < 12; i++) {
  board.push(Array(5).fill(null));
}

test('out of bound x move [-1, 5] should not be valid', () => (
  expect(isValidDestination(board, -1, 5, 0)).toBe(false)
));

test('out of bound y move [0, -1] should not be valid', () => (
  expect(isValidDestination(board, 0, -1, 0)).toBe(false)
));

board = placePiece(board, 0, 0, Piece('field_marshall', 0));
test('[0, 0] should be an invalid destination for affiliation 0', () => (
  expect(isValidDestination(board, 0, 0, 0)).toBe(false)
));
test('[0, 0] should be a valid destination for affiliation 1', () => (
  expect(isValidDestination(board, 0, 0, 1)).toBe(true)
));

// test isCenterPiece
test('[1, 2] should be a center piece', () => expect(isCamp(1, 2)).toBe(true));
test('[3, 2] should be a center piece', () => expect(isCamp(3, 2)).toBe(true));
test('[2, 3] should be a center piece', () => expect(isCamp(2, 3)).toBe(true));
test('[1, 4] should be a center piece', () => expect(isCamp(1, 4)).toBe(true));
test('[3, 4] should be a center piece', () => expect(isCamp(3, 4)).toBe(true));
test('[1, 7] should be a center piece', () => expect(isCamp(1, 7)).toBe(true));
test('[3, 7] should be a center piece', () => expect(isCamp(3, 7)).toBe(true));
test('[2, 8] should be a center piece', () => expect(isCamp(2, 8)).toBe(true));
test('[1, 9] should be a center piece', () => expect(isCamp(1, 9)).toBe(true));
test('[3, 9] should be a center piece', () => expect(isCamp(3, 9)).toBe(true));

// test generateAdjList
const adjList = generateAdjList();
test('should return a adjacency list', () => {
  expect(adjList instanceof Map).toBe(true);
  // console.log(Object.fromEntries(generateAdjList()));
});

// test getSuccessors
test('this should not crash', () => {
  console.log(getSuccessors(board, adjList, 0, 0, 0));
});