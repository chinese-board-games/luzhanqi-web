import { Center } from '@mantine/core';
import PropTypes from 'prop-types';

export default function Mountain({ rotation, isEnglish }) {
  return (
    <Center
      sx={(theme) => ({
        borderRadius: '100%',
        border: '.1em solid gray',
        writingMode: 'vertical-rl',
        fontSize: theme.other.mountainSizing.md.fontSize,
        zIndex: 100,
        whiteSpace: 'nowrap',
        rotate: isEnglish ? '-90deg' : rotation,
        fontFamily: 'SentyWEN2017',
        '@media (max-width: 450px)': {
          fontSize: theme.other.mountainSizing.sm.fontSize,
        },
        '@media (max-width: 375px)': {
          fontSize: theme.other.mountainSizing.xs.fontSize,
        },
      })}
      bg="whitesmoke"
      w="4em"
      h="4em"
    >
      {isEnglish ? 'MTN' : '山界'}
    </Center>
  );
}

Mountain.propTypes = {
  rotation: PropTypes.string.isRequired,
  isEnglish: PropTypes.bool.isRequired,
};
