/* eslint-disable react/prop-types */
import { Flex, Stack, Title } from '@mantine/core';
import Piece from 'components/Piece';

export default function DeadPieces({ deadPieces = [], affiliation, isEnglish }) {
  const friendlyDead = deadPieces.filter((piece) => piece.affiliation === affiliation);
  const enemyDead = deadPieces.filter((piece) => piece.affiliation !== affiliation);

  const DisplayDead = ({ dead, title }) => {
    return (
      <>
        {dead.length ? <Title order={4}>{title}</Title> : null}
        <Flex style={{ width: '16em', gap: '0.5em', flexWrap: 'wrap', marginBottom: '2em' }}>
          {dead.map((piece, idx) => (
            <Piece
              key={`${title}_${piece.id}_${idx}`}
              name={piece.name}
              affiliation={piece.affiliation}
              isEnglish={isEnglish}
            />
          ))}
        </Flex>
      </>
    );
  };

  return (
    <Stack style={{ marginTop: '1em', gap: '0.5em' }}>
      {affiliation === -1 ? (
        <>
          <DisplayDead dead={deadPieces} title="Dead" />
        </>
      ) : (
        <>
          <DisplayDead dead={enemyDead} title="Enemy dead" />
          <DisplayDead dead={friendlyDead} title="Friendly dead" />
        </>
      )}
    </Stack>
  );
}
