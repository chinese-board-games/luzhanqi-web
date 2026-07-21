import React, { useState } from 'react';
import {
  Modal,
  Button,
  Stack,
  Title,
  Text,
  Group,
  Box,
  Stepper,
  Card,
  ThemeIcon,
  Badge,
  Divider,
  Grid,
  Alert,
  Tabs,
} from '@mantine/core';
import {
  IconQuestionMark,
  IconChess,
  IconTarget,
  IconFlag,
  IconBomb,
  IconShield,
  IconShieldHalfFilled,
  IconSword,
  IconHelp,
  IconUser,
  IconUserShield,
  IconTool,
  IconBadge as IconBadgeIcon,
  IconChevronUp,
  IconStar,
  IconMedal,
  IconCrown,
  IconShieldStar,
  IconSwords,
  IconTrain,
  IconBook,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getPieceInfo } from 'data/pieceInfo';
import PropTypes from 'prop-types';
import Rulebook from './Rulebook';

const iconMap = {
  IconFlag: <IconFlag size={20} />,
  IconBomb: <IconBomb size={20} />,
  IconShield: <IconShield size={20} />,
  IconShieldHalfFilled: <IconShieldHalfFilled size={20} />,
  IconSword: <IconSword size={20} />,
  IconUser: <IconUser size={20} />,
  IconUserShield: <IconUserShield size={20} />,
  IconTool: <IconTool size={20} />,
  IconBadge: <IconBadgeIcon size={20} />,
  IconChevronUp: <IconChevronUp size={20} />,
  IconStar: <IconStar size={20} />,
  IconMedal: <IconMedal size={20} />,
  IconCrown: <IconCrown size={20} />,
  IconShieldStar: <IconShieldStar size={20} />,
  IconTarget: <IconTarget size={20} />,
  IconSwords: <IconSwords size={20} />,
  IconChess: <IconChess size={20} />,
  IconTrain: <IconTrain size={20} />,
};

const Instructions = ({ opened, onClose, gamePhase = 0 }) => {
  const { t } = useTranslation('instructions');
  const { t: tPieces } = useTranslation('pieces');
  const [activeStep, setActiveStep] = useState(0);

  const phaseKey = [0, 1, 2, 3].includes(gamePhase) ? gamePhase : 'default';
  const phaseInstructions = {
    title: t(`phases.${phaseKey}.title`),
    steps: t(`phases.${phaseKey}.steps`, { returnObjects: true, defaultValue: [] }),
  };

  const pieceInfo = getPieceInfo(tPieces);

  const renderPieceCard = (piece) => (
    <Card key={piece.id} shadow="sm" padding="sm" radius="md" withBorder>
      <Group style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
        <ThemeIcon color="blue" variant="light" size={75}>
          {iconMap[piece.icon] || <IconQuestionMark size={75} />}
        </ThemeIcon>
        <Box>
          <Text fw={500}>{piece.title}</Text>
          <Text size="sm" c="dimmed">
            {piece.description}
          </Text>
          <Group gap="xs" mt="xs">
            {piece.rules.map((rule) => (
              <Badge key={rule} color="blue" variant="light" size="sm">
                {rule}
              </Badge>
            ))}
          </Group>
        </Box>
      </Group>
    </Card>
  );

  return (
    <Modal opened={opened} onClose={onClose} title={phaseInstructions.title} size="xl" centered>
      <Tabs defaultValue="quick-steps">
        <Tabs.List>
          <Tabs.Tab value="quick-steps" leftSection={<IconHelp size={16} />}>
            {t('tabs.quickSteps')}
          </Tabs.Tab>
          <Tabs.Tab value="rulebook" leftSection={<IconBook size={16} />}>
            {t('tabs.rulebook')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="quick-steps" pt="md">
          <Stack>
            <Stepper active={activeStep} onStepClick={setActiveStep} breakpoint="sm">
              {phaseInstructions.steps.map((step, index) => (
                <Stepper.Step key={index} label={step.title} description={step.description} />
              ))}
            </Stepper>

            <Divider />

            {gamePhase === 2 && (
              <Box>
                <Title order={4} mb="md">
                  {t('pieceReference')}
                </Title>
                <Grid>
                  {Object.entries(pieceInfo).map(([id, piece]) => (
                    <Grid.Col span={6} key={id}>
                      {renderPieceCard(piece)}
                    </Grid.Col>
                  ))}
                </Grid>
              </Box>
            )}

            {gamePhase === 0 && (
              <Alert icon={<IconHelp size={16} />} title={t('quickStart.title')} color="green">
                <Text size="sm">{t('quickStart.body')}</Text>
              </Alert>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="rulebook" pt="md">
          <Rulebook />
        </Tabs.Panel>
      </Tabs>

      <Group justify="right" mt="md">
        <Button variant="outline" onClick={onClose}>
          {t('close')}
        </Button>
      </Group>
    </Modal>
  );
};

Instructions.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  gamePhase: PropTypes.number,
};

export default Instructions;
