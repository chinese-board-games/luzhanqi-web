import React, { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconHelp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import Instructions from 'components/Instructions';
import PropTypes from 'prop-types';

const HelpButton = ({ gamePhase = 0, position = 'fixed' }) => {
  const { t } = useTranslation();
  const [instructionsOpened, setInstructionsOpened] = useState(false);

  const buttonStyle = {
    position,
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  };

  return (
    <>
      <Tooltip label={t('help.gameInstructions')} position="left" withArrow>
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
      />
    </>
  );
};

HelpButton.propTypes = {
  gamePhase: PropTypes.number,
  position: PropTypes.oneOf(['fixed', 'absolute', 'relative']),
};

export default HelpButton;
