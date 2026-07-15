/* eslint-disable react/prop-types */
import { Container, Flex, Title } from '@mantine/core';
import Piece from 'components/Piece';

export default function DeadPieces({ deadPieces, isEnglish }) {
  return (
    <Container style={{ marginTop: '0.5em' }}>
      <Title order={3}>{isEnglish ? 'Dead pieces' : '陣亡棋子'}</Title>
      <Flex style={{ gap: '0.5em', flexWrap: 'wrap', marginBottom: '2em' }}>
        {deadPieces.map((piece) => (
          <Piece
            key={piece.id}
            name={piece.name}
            affiliation={piece.affiliation}
            isEnglish={isEnglish}
          />
        ))}
      </Flex>
    </Container>
  );
}
