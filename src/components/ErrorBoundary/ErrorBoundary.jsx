import React from 'react';
import { Button, Flex, Title, Text } from '@mantine/core';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={{ height: '100vh', gap: '1em', textAlign: 'center', padding: '1em' }}
        >
          <Title order={2}>Something went wrong.</Title>
          <Text>Please try reloading the page.</Text>
          <Button color="violet" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Flex>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
