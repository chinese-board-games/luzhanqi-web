const theme = {
  colors: {
    'pastel-tan': [
      '#f6f5ef',
      '#e3e1d3',
      '#d0cdb5',
      '#beb995',
      '#aca576',
      '#938b5c',
      '#726c49',
      '#514d35',
      '#312e1f',
      '#100f09',
    ],
  },
};

// including other directly in theme doesn't work for some reason
export const other = {
  pieceSizing: {
    md: {
      width: '4em',
      height: '2em',
      fontSize: '15pt',
    },
    sm: {
      width: '3.5em',
      height: '1.75em',
      fontSize: '13pt',
    },
    xs: {
      width: '3em',
      height: '1.75em',
      fontSize: '10pt',
    },
  },
  positionSizing: {
    md: {
      width: '4.5em',
      height: '2.5em',
      fontSize: '16pt',
    },
    sm: {
      width: '3.8em',
      height: '2em',
      fontSize: '13pt',
    },
    xs: {
      width: '3.75em',
      height: '2em',
      fontSize: '10pt',
    },
  },
  hqSizing: {
    md: {
      width: '4em',
      height: '4em',
      fontSize: '16pt',
    },
    sm: {
      width: '3em',
      height: '3em',
      fontSize: '12pt',
    },
    xs: {
      width: '2.75em',
      height: '3em',
      fontSize: '10pt',
    },
  },
  campSizing: {
    md: {
      width: '4em',
      height: '4em',
      fontSize: '16pt',
    },
    sm: {
      width: '3.5em',
      height: '3.5em',
      fontSize: '12pt',
    },
  },
};

export default theme;
