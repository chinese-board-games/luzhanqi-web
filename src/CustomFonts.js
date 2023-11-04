import { Global } from '@mantine/core';
import senty from './SentyWEN2017.ttf';

export function CustomFonts() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'SentyWEN2017',
            src: `url('${senty}') format("truetype")`,
            fontWeight: 400,
            fontStyle: 'normal',
          },
        },
      ]}
    />
  );
}
