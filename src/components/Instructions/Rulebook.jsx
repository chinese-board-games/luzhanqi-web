import React from 'react';
import {
  Accordion,
  Text,
  Title,
  Stack,
  Group,
  Center,
  Table,
  List,
  Box,
  Badge,
} from '@mantine/core';
import PropTypes from 'prop-types';

// standalone tiles matching the real board's visual language (see
// Position.jsx/Mountain.jsx) so a new player recognizes these shapes once
// they're actually looking at the board
function CampTile({ isEnglish }) {
  return (
    <Center
      bg="pastel-tan.1"
      sx={{
        borderRadius: '100%',
        border: '.1em solid black',
        width: '4.5em',
        height: '4.5em',
        fontSize: '0.8em',
      }}
    >
      {isEnglish ? 'Camp' : '行營'}
    </Center>
  );
}
CampTile.propTypes = { isEnglish: PropTypes.bool };

function HqTile({ isEnglish }) {
  return (
    <Center
      bg="pastel-tan.1"
      sx={{
        border: '.1em solid black',
        borderRadius: '3em 3em 1em 1em',
        width: '4.5em',
        height: '4.5em',
        fontSize: '0.8em',
      }}
    >
      {isEnglish ? 'HQ' : '大本營'}
    </Center>
  );
}
HqTile.propTypes = { isEnglish: PropTypes.bool };

function MountainTile({ isEnglish }) {
  return (
    <Center
      bg="whitesmoke"
      sx={{
        borderRadius: '100%',
        border: '.1em solid gray',
        width: '4.5em',
        height: '4.5em',
        fontSize: '0.8em',
      }}
    >
      {isEnglish ? 'Mountain' : '山界'}
    </Center>
  );
}
MountainTile.propTypes = { isEnglish: PropTypes.bool };

function RailroadSwatch({ isEnglish }) {
  return (
    <Center
      sx={{
        width: '4.5em',
        height: '4.5em',
        fontSize: '0.8em',
      }}
    >
      <Stack spacing="0.3em" align="center">
        <Box
          sx={{
            width: '3em',
            borderTop: '.2em dashed gray',
          }}
        />
        <Text size="xs" ta="center">
          {isEnglish ? 'Railroad' : '鐵路'}
        </Text>
      </Stack>
    </Center>
  );
}
RailroadSwatch.propTypes = { isEnglish: PropTypes.bool };

// piece rank table data - order/count match the real gameplay pieces in
// src/models/Piece/Piece.js; kept as a small local list (rather than
// importing pieceData.json) since this table's job is specifically to show
// rank order, which pieceData.json doesn't carry as a number
const RANKED_PIECES = [
  { name: 'Field Marshal', name_zh: '司令', order: 9, count: 1 },
  { name: 'General', name_zh: '軍長', order: 8, count: 1 },
  { name: 'Major General', name_zh: '師長', order: 7, count: 2 },
  { name: 'Brigadier General', name_zh: '旅長', order: 6, count: 2 },
  { name: 'Colonel', name_zh: '團長', order: 5, count: 2 },
  { name: 'Major', name_zh: '營長', order: 4, count: 2 },
  { name: 'Captain', name_zh: '連長', order: 3, count: 3 },
  { name: 'Lieutenant', name_zh: '排長', order: 2, count: 3 },
  { name: 'Engineer', name_zh: '工兵', order: 1, count: 3 },
];

const Rulebook = ({ isEnglish = false }) => {
  return (
    <Stack>
      <Text size="sm" c="dimmed">
        {isEnglish
          ? "New to Luzhanqi? Here's everything you need to know before your first game."
          : '第一次玩陸戰棋嗎？以下是您第一場遊戲前需要了解的所有內容。'}
      </Text>

      <Accordion defaultValue="objective" variant="separated">
        <Accordion.Item value="objective">
          <Accordion.Control>
            <Title order={5}>{isEnglish ? 'Objective' : '遊戲目標'}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">
              {isEnglish
                ? 'Capture the opponent\'s Flag to win. Under the "Capture the Flag" rule variant, capturing it isn\'t enough by itself - the piece that captures it must then carry it all the way back to your own headquarters (HQ) before you win. A game also ends immediately if your opponent forfeits.'
                : '俘獲對手的軍旗即可獲勝。在「奪旗規則」變體下，光是俘獲軍旗還不夠——俘獲軍旗的棋子必須將其一路帶回您自己的大本營才能獲勝。若對手投降，遊戲也會立即結束。'}
            </Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="board">
          <Accordion.Control>
            <Title order={5}>{isEnglish ? 'The Board' : '棋盤'}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Text size="sm">
                {isEnglish
                  ? 'The board is 12 rows by 5 columns, split into two mirrored halves separated by a mountain range with two crossing points. Each half has a few special kinds of cell:'
                  : '棋盤為 12 行 5 列，分為兩個由山界隔開的鏡像半場，山界有兩個可通過的缺口。每個半場都有幾種特殊格子：'}
              </Text>

              <Group justify="center" gap="xl" py="sm">
                <Stack align="center" gap="xs">
                  <HqTile isEnglish={isEnglish} />
                  <Text size="xs" fw={500}>
                    {isEnglish ? 'HQ' : '大本營'}
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <CampTile isEnglish={isEnglish} />
                  <Text size="xs" fw={500}>
                    {isEnglish ? 'Camp' : '行營'}
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <RailroadSwatch isEnglish={isEnglish} />
                  <Text size="xs" fw={500}>
                    {isEnglish ? 'Railroad line' : '鐵路連線'}
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <MountainTile isEnglish={isEnglish} />
                  <Text size="xs" fw={500}>
                    {isEnglish ? 'Mountain' : '山界'}
                  </Text>
                </Stack>
              </Group>

              <List size="sm" spacing="xs">
                <List.Item>
                  <b>{isEnglish ? 'Headquarters (HQ):' : '大本營：'}</b>{' '}
                  {isEnglish
                    ? 'the two cells at the very back of your side. Your Flag must start here.'
                    : '位於己方最後排的兩個格子。您的軍旗必須從此處開始。'}
                </List.Item>
                <List.Item>
                  <b>{isEnglish ? 'Camps:' : '行營：'}</b>{' '}
                  {isEnglish
                    ? "safe zones - a piece standing in a camp can never be attacked or captured, by anyone. Camps also connect diagonally to their neighbors, so it's the one place pieces can move/attack on the diagonal."
                    : '安全區域——站在行營內的棋子永遠不會被任何一方攻擊或俘獲。行營也與相鄰格子有對角連線，是棋子唯一能斜向移動或攻擊的地方。'}
                </List.Item>
                <List.Item>
                  <b>{isEnglish ? 'Railroads:' : '鐵路：'}</b>{' '}
                  {isEnglish
                    ? 'shown as dashed lines connecting cells. Most pieces can travel any distance along a straight railroad line in one move, but can\'t turn a corner mid-move. The Engineer is the exception - it can turn corners freely along the rail network. (Under the "Flying Bombs" variant, the Bomb can too.)'
                    : '以虛線連接格子表示。大多數棋子可以在一步之內沿直線鐵路移動任意距離，但移動途中不能轉彎。工兵是例外——它可以在鐵路網上自由轉彎。（在「飛彈」規則變體下，炸彈也可以。）'}
                </List.Item>
                <List.Item>
                  <b>{isEnglish ? 'Everywhere else:' : '其餘格子：'}</b>{' '}
                  {isEnglish
                    ? 'ordinary connections - one step at a time, no diagonals, no corner-turning.'
                    : '一般連線——一次只能移動一步，不能斜向移動，也不能轉彎。'}
                </List.Item>
                <List.Item>
                  <b>{isEnglish ? 'Mountains:' : '山界：'}</b>{' '}
                  {isEnglish
                    ? 'the boundary between the two halves. No piece can cross it except through the two open crossing points.'
                    : '兩個半場之間的邊界。除了兩個開放的缺口外，任何棋子都無法穿越。'}
                </List.Item>
              </List>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pieces">
          <Accordion.Control>
            <Title order={5}>{isEnglish ? 'The Pieces' : '棋子'}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Text size="sm">
                {isEnglish
                  ? 'Each side has 25 pieces: 12 combat ranks (below, weakest to strongest) plus the Flag, 2 Bombs, and 3 Landmines, which never move or attack on their own.'
                  : '每方共有 25 枚棋子：12 個戰鬥階級（如下，由弱到強）加上軍旗、2 枚炸彈和 3 枚地雷，後三者自身不能移動或攻擊。'}
              </Text>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{isEnglish ? 'Rank' : '階級'}</Table.Th>
                    <Table.Th>{isEnglish ? 'Piece' : '棋子'}</Table.Th>
                    <Table.Th>{isEnglish ? 'Count' : '數量'}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {RANKED_PIECES.map((piece) => (
                    <Table.Tr key={piece.order}>
                      <Table.Td>{piece.order}</Table.Td>
                      <Table.Td>{isEnglish ? piece.name : piece.name_zh}</Table.Td>
                      <Table.Td>{piece.count}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group gap="xs">
                <Badge color="gray" variant="light">
                  {isEnglish ? 'Flag ×1' : '軍旗 ×1'}
                </Badge>
                <Badge color="gray" variant="light">
                  {isEnglish ? 'Bomb ×2' : '炸彈 ×2'}
                </Badge>
                <Badge color="gray" variant="light">
                  {isEnglish ? 'Landmine ×3' : '地雷 ×3'}
                </Badge>
              </Group>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="combat">
          <Accordion.Control>
            <Title order={5}>{isEnglish ? 'Combat Rules' : '戰鬥規則'}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <List size="sm" spacing="xs">
              <List.Item>
                {isEnglish
                  ? 'Move a piece onto an enemy piece to attack it. The higher-ranked piece wins and survives on that cell; the loser is removed.'
                  : '將棋子移動到敵方棋子上即可發動攻擊。階級較高的棋子獲勝並留在該格子上；戰敗方被移除。'}
              </List.Item>
              <List.Item>
                {isEnglish
                  ? 'Equal ranks, or an attack involving a Bomb (attacking or being attacked), destroy both pieces.'
                  : '階級相同，或攻擊涉及炸彈（無論是攻擊方或被攻擊方），雙方棋子都會被摧毀。'}
              </List.Item>
              <List.Item>
                {isEnglish
                  ? 'The Engineer is the only piece that safely defuses a Landmine - every other piece that attacks one is destroyed along with it (unless the "Landmines Survive" variant is on, in which case only the attacker dies).'
                  : '工兵是唯一能安全拆除地雷的棋子——任何其他棋子攻擊地雷都會與其同歸於盡（除非開啟「地雷不會被摧毀」規則變體，此時只有攻擊方陣亡）。'}
              </List.Item>
              <List.Item>
                {isEnglish
                  ? "A piece standing in a Camp can't be attacked at all, by any piece."
                  : '站在行營內的棋子無法被任何棋子攻擊。'}
              </List.Item>
            </List>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="setup">
          <Accordion.Control>
            <Title order={5}>{isEnglish ? 'Setup Rules' : '佈局規則'}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <List size="sm" spacing="xs">
              <List.Item>
                {isEnglish
                  ? 'The Flag must be placed in one of your two HQ cells.'
                  : '軍旗必須放置在您的兩個大本營格子之一。'}
              </List.Item>
              <List.Item>
                {isEnglish
                  ? "Bombs can't be placed in your front row (closest to the mountains)."
                  : '炸彈不能放置在您的前排（最靠近山界的一排）。'}
              </List.Item>
              <List.Item>
                {isEnglish
                  ? 'Landmines can only be placed in your back two rows.'
                  : '地雷只能放置在您的後兩排。'}
              </List.Item>
              <List.Item>
                {isEnglish
                  ? 'Camp cells must always stay empty during setup.'
                  : '佈局時行營格子必須保持淨空。'}
              </List.Item>
            </List>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="variants">
          <Accordion.Control>
            <Title order={5}>{isEnglish ? 'Optional Rule Variants' : '可選規則變體'}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed" mb="sm">
              {isEnglish
                ? "The host can turn any of these on before starting a game - they're all off by default except fog of war."
                : '主持人可以在開始遊戲前開啟以下任何規則——除戰爭迷霧外，其餘預設皆為關閉。'}
            </Text>
            <List size="sm" spacing="sm">
              <List.Item>
                <b>{isEnglish ? 'Fog of War (default on):' : '戰爭迷霧（預設開啟）：'}</b>{' '}
                {isEnglish
                  ? "you can't see what an enemy piece is until it attacks or is attacked - it shows up as a generic unknown piece until then."
                  : '在敵方棋子攻擊或被攻擊之前，您無法得知其身份——在此之前它只會顯示為未知棋子。'}
              </List.Item>
              <List.Item>
                <b>{isEnglish ? 'Landmines Survive:' : '地雷不會被摧毀：'}</b>{' '}
                {isEnglish
                  ? 'a non-Engineer attacking a Landmine is destroyed, but the mine stays on the board instead of also being destroyed (a Bomb attacking a mine still destroys both, regardless of this setting).'
                  : '非工兵棋子攻擊地雷時會被摧毀，但地雷本身會留在棋盤上而不會一同被摧毀（炸彈攻擊地雷時，無論此設定為何，雙方仍會同歸於盡）。'}
              </List.Item>
              <List.Item>
                <b>{isEnglish ? 'Flying Bombs:' : '飛彈：'}</b>{' '}
                {isEnglish
                  ? 'Bombs move like the Engineer - any distance along the railroad, turning corners freely - instead of one step at a time.'
                  : '炸彈可以像工兵一樣移動——沿鐵路移動任意距離並自由轉彎——而不是一次只能移動一步。'}
              </List.Item>
              <List.Item>
                <b>{isEnglish ? 'Capture the Flag:' : '奪旗規則：'}</b>{' '}
                {isEnglish
                  ? "capturing the enemy Flag doesn't win the game by itself - the capturing piece must carry it all the way back to your own HQ. If that carrier is destroyed along the way, the Flag drops and respawns at its original owner's home row for someone else to capture. A Bomb attacking the Flag under this variant only destroys the Bomb, leaving the Flag in place - it can only ever be captured, never blown up outright."
                  : '俘獲敵方軍旗本身並不會直接獲勝——俘獲軍旗的棋子必須將其一路帶回己方大本營。若該棋子在途中被摧毀，軍旗會掉落並在原主人的後排重新出現，供其他棋子俘獲。在此規則下，炸彈攻擊軍旗只會摧毀炸彈本身，軍旗仍留在原地——軍旗只能被俘獲，永遠不會被直接炸毀。'}
              </List.Item>
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

Rulebook.propTypes = {
  isEnglish: PropTypes.bool,
};

export default Rulebook;
