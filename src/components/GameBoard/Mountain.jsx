import { Center } from '@mantine/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isVerticalScript } from '../../i18n';

export default function Mountain({ rotation }) {
  const { t, i18n } = useTranslation('board');
  const vertical = isVerticalScript(i18n.language);
  return (
    <Center
      sx={(theme) => ({
        borderRadius: '100%',
        border: '.1em solid gray',
        writingMode: vertical ? 'vertical-rl' : 'horizontal-tb',
        fontSize: theme.other.mountainSizing.md.fontSize,
        zIndex: 100,
        whiteSpace: 'nowrap',
        rotate: vertical ? rotation || '0deg' : '0deg',
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
      {t('mountain')}
    </Center>
  );
}

Mountain.propTypes = {
  rotation: PropTypes.string,
};
