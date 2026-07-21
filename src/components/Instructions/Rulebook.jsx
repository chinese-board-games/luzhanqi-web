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
import { useTranslation } from 'react-i18next';

// standalone tiles matching the real board's visual language (see
// Position.jsx/Mountain.jsx) so a new player recognizes these shapes once
// they're actually looking at the board
function CampTile() {
  const { t } = useTranslation('rulebook');
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
      {t('tiles.camp')}
    </Center>
  );
}

function HqTile() {
  const { t } = useTranslation('rulebook');
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
      {t('tiles.hq')}
    </Center>
  );
}

function MountainTile() {
  const { t } = useTranslation('rulebook');
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
      {t('tiles.mountain')}
    </Center>
  );
}

function RailroadSwatch() {
  const { t } = useTranslation('rulebook');
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
          {t('tiles.railroad')}
        </Text>
      </Stack>
    </Center>
  );
}

// piece rank table order/count - matches the real gameplay pieces in
// src/models/Piece/Piece.js; kept as a small local list (rather than
// importing pieceData.json) since this table's job is specifically to show
// rank order, which pieceData.json doesn't carry as a number. Names come
// from rulebook.json's "ranks" array (same order, weakest to strongest
// reversed: strongest to weakest to match display order below).
const RANKED_PIECE_META = [
  { order: 9, count: 1 },
  { order: 8, count: 1 },
  { order: 7, count: 2 },
  { order: 6, count: 2 },
  { order: 5, count: 2 },
  { order: 4, count: 2 },
  { order: 3, count: 3 },
  { order: 2, count: 3 },
  { order: 1, count: 3 },
];

const Rulebook = () => {
  const { t } = useTranslation('rulebook');
  const rankNames = t('ranks', { returnObjects: true });
  const rankedPieces = RANKED_PIECE_META.map((meta, i) => ({ ...meta, name: rankNames[i] }));

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        {t('intro')}
      </Text>

      <Accordion defaultValue="objective" variant="separated">
        <Accordion.Item value="objective">
          <Accordion.Control>
            <Title order={5}>{t('sections.objective.title')}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm">{t('sections.objective.body')}</Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="board">
          <Accordion.Control>
            <Title order={5}>{t('sections.board.title')}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Text size="sm">{t('sections.board.intro')}</Text>

              <Group justify="center" gap="xl" py="sm">
                <Stack align="center" gap="xs">
                  <HqTile />
                  <Text size="xs" fw={500}>
                    {t('tiles.hq')}
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <CampTile />
                  <Text size="xs" fw={500}>
                    {t('tiles.camp')}
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <RailroadSwatch />
                  <Text size="xs" fw={500}>
                    {t('tiles.railroad')}
                  </Text>
                </Stack>
                <Stack align="center" gap="xs">
                  <MountainTile />
                  <Text size="xs" fw={500}>
                    {t('tiles.mountain')}
                  </Text>
                </Stack>
              </Group>

              <List size="sm" spacing="xs">
                <List.Item>
                  <b>{t('sections.board.hq.label')}</b> {t('sections.board.hq.body')}
                </List.Item>
                <List.Item>
                  <b>{t('sections.board.camps.label')}</b> {t('sections.board.camps.body')}
                </List.Item>
                <List.Item>
                  <b>{t('sections.board.railroads.label')}</b> {t('sections.board.railroads.body')}
                </List.Item>
                <List.Item>
                  <b>{t('sections.board.elsewhere.label')}</b> {t('sections.board.elsewhere.body')}
                </List.Item>
                <List.Item>
                  <b>{t('sections.board.mountains.label')}</b> {t('sections.board.mountains.body')}
                </List.Item>
              </List>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="pieces">
          <Accordion.Control>
            <Title order={5}>{t('sections.pieces.title')}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              <Text size="sm">{t('sections.pieces.intro')}</Text>
              <Table striped withTableBorder withColumnBorders>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t('sections.pieces.rankHeader')}</Table.Th>
                    <Table.Th>{t('sections.pieces.pieceHeader')}</Table.Th>
                    <Table.Th>{t('sections.pieces.countHeader')}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rankedPieces.map((piece) => (
                    <Table.Tr key={piece.order}>
                      <Table.Td>{piece.order}</Table.Td>
                      <Table.Td>{piece.name}</Table.Td>
                      <Table.Td>{piece.count}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              <Group gap="xs">
                <Badge color="gray" variant="light">
                  {t('sections.pieces.flagCount')}
                </Badge>
                <Badge color="gray" variant="light">
                  {t('sections.pieces.bombCount')}
                </Badge>
                <Badge color="gray" variant="light">
                  {t('sections.pieces.landmineCount')}
                </Badge>
              </Group>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="combat">
          <Accordion.Control>
            <Title order={5}>{t('sections.combat.title')}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <List size="sm" spacing="xs">
              {t('sections.combat.rules', { returnObjects: true }).map((rule) => (
                <List.Item key={rule}>{rule}</List.Item>
              ))}
            </List>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="setup">
          <Accordion.Control>
            <Title order={5}>{t('sections.setup.title')}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <List size="sm" spacing="xs">
              {t('sections.setup.rules', { returnObjects: true }).map((rule) => (
                <List.Item key={rule}>{rule}</List.Item>
              ))}
            </List>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="variants">
          <Accordion.Control>
            <Title order={5}>{t('sections.variants.title')}</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <Text size="sm" c="dimmed" mb="sm">
              {t('sections.variants.intro')}
            </Text>
            <List size="sm" spacing="sm">
              <List.Item>
                <b>{t('sections.variants.fogOfWar.label')}</b>{' '}
                {t('sections.variants.fogOfWar.body')}
              </List.Item>
              <List.Item>
                <b>{t('sections.variants.landminesSurvive.label')}</b>{' '}
                {t('sections.variants.landminesSurvive.body')}
              </List.Item>
              <List.Item>
                <b>{t('sections.variants.flyingBombs.label')}</b>{' '}
                {t('sections.variants.flyingBombs.body')}
              </List.Item>
              <List.Item>
                <b>{t('sections.variants.captureTheFlag.label')}</b>{' '}
                {t('sections.variants.captureTheFlag.body')}
              </List.Item>
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
};

export default Rulebook;
