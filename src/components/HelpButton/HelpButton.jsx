import React, { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import Instructions from 'components/Instructions';
import PropTypes from 'prop-types';

const HelpButton = ({ gamePhase = 0, isEnglish = false, position = 'fixed' }) => {
  const [instructionsOpened, setInstructionsOpened] = useState(false);

  const buttonStyle = {
    position,
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  };

  return (
    <>
      <Tooltip label={isEnglish ? 'Game Instructions' : '遊戲說明'} position="left" withArrow>
        <ActionIcon
          size="xl"
          radius="xl"
          variant="filled"
          color="blue"
          onClick={() => setInstructionsOpened(true)}
          style={buttonStyle}
        >
          <IconHelp size={24} />
        </ActionIcon>
      </Tooltip>

      <Instructions
        opened={instructionsOpened}
        onClose={() => setInstructionsOpened(false)}
        gamePhase={gamePhase}
        isEnglish={isEnglish}
      />
    </>
  );
};

HelpButton.propTypes = {
  gamePhase: PropTypes.number,
  isEnglish: PropTypes.bool,
  position: PropTypes.oneOf(['fixed', 'absolute', 'relative']),
};

export default HelpButton;
