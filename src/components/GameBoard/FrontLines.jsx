import { Center, Stack, Text } from '@mantine/core';
import PropTypes from 'prop-types';

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
      {isEnglish ? (
        <Text sx={{ fontFamily: 'SentyWEN2017' }}>Front Line</Text>
      ) : (
        <Stack sx={{ gap: '0' }}>
          <Text sx={{ rotate: '180deg', fontFamily: 'SentyWEN2017' }}>前綫</Text>
          <Text sx={{ fontFamily: 'SentyWEN2017' }}>前綫</Text>
        </Stack>
      )}
    </Center>
  );
}

FrontLines.propTypes = {
  isEnglish: PropTypes.bool,
};
