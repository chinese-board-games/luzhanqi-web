/* eslint-disable react/prop-types */
import { Container, Flex, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import Piece from 'components/Piece';

export default function DeadPieces({ deadPieces }) {
  const { t } = useTranslation('board');
  return (
    <Container style={{ marginTop: '0.5em' }}>
      <Title order={3}>{t('deadPieces')}</Title>
      <Flex style={{ gap: '0.5em', flexWrap: 'wrap', marginBottom: '2em' }}>
        {deadPieces.map((piece) => (
          <Piece key={piece.id} name={piece.name} affiliation={piece.affiliation} />
        ))}
      </Flex>
    </Container>
  );
}
