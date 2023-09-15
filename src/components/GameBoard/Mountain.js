import { Center } from '@mantine/core';
import PropTypes from 'prop-types';

export default function Mountain({ rotation }) {
  return (
    <Center
      sx={{
        borderRadius: '100%',
        border: '.1em solid gray',
        writingMode: 'vertical-rl',
        fontSize: '18pt',
        zIndex: 100,
        rotate: rotation || '0deg'
      }}
      bg="whitesmoke"
      w="4em"
      h="4em">
      山界
    </Center>
  );
}

Mountain.propTypes = {
  rotation: PropTypes.string
};
