import { Center, Stack, Text } from '@mantine/core';

export default function FrontLines() {
  return (
    <Center
      sx={{
        border: '.1em solid gray',
        fontSize: '18pt',
        zIndex: 100
      }}
      bg="whitesmoke"
      w="4em"
      h="4em">
      <Stack sx={{ gap: '0' }}>
        <Text sx={{ rotate: '180deg', fontFamily: 'SentyWEN2017' }}>前綫</Text>
        <Text sx={{ fontFamily: 'SentyWEN2017' }}>前綫</Text>
      </Stack>
    </Center>
  );
}
