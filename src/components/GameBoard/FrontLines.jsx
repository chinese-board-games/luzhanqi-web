import { Center, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { isVerticalScript } from '../../i18n';

export default function FrontLines() {
  const { t, i18n } = useTranslation('board');
  const vertical = isVerticalScript(i18n.language);
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
      {vertical ? (
        <Stack sx={{ gap: '0' }}>
          <Text sx={{ rotate: '180deg', fontFamily: 'SentyWEN2017' }}>{t('frontLine')}</Text>
          <Text sx={{ fontFamily: 'SentyWEN2017' }}>{t('frontLine')}</Text>
        </Stack>
      ) : (
        <Text sx={{ fontFamily: 'SentyWEN2017' }}>{t('frontLine')}</Text>
      )}
    </Center>
  );
}
