import PropTypes from 'prop-types';
import { Center, Stack, Text } from '@mantine/core';

export default function FrontLines({ isEnglish }) {
  return (
    <Center
      sx={(theme) => ({
        border: '.1em solid gray',
        fontSize: theme.other.fontLinesSizing.md.fontSize,
        zIndex: 100,
        whiteSpace: 'nowrap',
        '@media (max-width: 450px)': {
          fontSize: theme.other.fontLinesSizing.sm.fontSize,
        },
        '@media (max-width: 375px)': {
          fontSize: theme.other.fontLinesSizing.xs.fontSize,
        },
      })}
      bg="whitesmoke"
      w="4em"
      h="4em"
    >
      <Stack sx={{ gap: '0' }}>
        <Text sx={{ rotate: '180deg', fontFamily: 'SentyWEN2017' }}>
          {isEnglish ? 'FRONT' : '前綫'}
        </Text>
        <Text sx={{ fontFamily: 'SentyWEN2017' }}>{isEnglish ? 'FRONT' : '前綫'}</Text>
      </Stack>
    </Center>
  );
}

FrontLines.propTypes = {
  isEnglish: PropTypes.bool.isRequired,
};
