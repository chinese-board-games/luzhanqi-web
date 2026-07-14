import React, { useState, useContext, useEffect } from 'react';
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
} from '@mantine/core';
import {
  IconQuestionMark,
  IconChess,
  IconTarget,
  IconFlag,
  IconBomb,
  IconShield,
  IconSword,
  IconHelp,
  IconUser,
  IconChevronUp,
  IconStar,
  IconMedal,
  IconCrown,
  IconShieldStar,
  IconSwords,
  IconTrain,
} from '@tabler/icons-react';
import { GameContext } from 'contexts/GameContext';
import pieceRules from 'data/pieceData.json';
import PropTypes from 'prop-types';

const iconMap = {
  IconFlag: <IconFlag size={20} />,
  IconBomb: <IconBomb size={20} />,
  IconShield: <IconShield size={20} />,
  IconSword: <IconSword size={20} />,
  IconUser: <IconUser size={20} />,
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

const Instructions = ({ opened, onClose, gamePhase = 0, isEnglish = false }) => {
  const [activeStep, setActiveStep] = useState(0);

  const getPhaseInstructions = () => {
    switch (gamePhase) {
      case 0:
        return {
          title: isEnglish ? 'How to Join a Game' : '如何加入遊戲',
          steps: [
            {
              title: isEnglish ? 'Create or Join' : '創建或加入',
              description: isEnglish
                ? 'Either create a new game as host or join an existing game using a game ID.'
                : '您可以創建新遊戲作為主持人，或使用遊戲ID加入現有遊戲。',
            },
            {
              title: isEnglish ? 'Wait for Players' : '等待玩家',
              description: isEnglish
                ? 'Wait for another player to join. The host can start the game when ready.'
                : '等待其他玩家加入。主持人準備好後可以開始遊戲。',
            },
            {
              title: isEnglish ? 'Game Settings' : '遊戲設置',
              description: isEnglish
                ? 'Configure game options like fog of war before starting.'
                : '在開始前配置遊戲選項，如戰爭迷霧。',
            },
          ],
        };
      case 1:
        return {
          title: isEnglish ? 'Setting Up Your Board' : '設置您的棋盤',
          steps: [
            {
              title: isEnglish ? 'Drag and Drop Pieces' : '拖放棋子',
              description: isEnglish
                ? 'Drag pieces from the top area to your half of the board. Each piece has specific placement rules.'
                : '將棋子從頂部區域拖放到您的半個棋盤上。每個棋子都有特定的放置規則。',
            },
            {
              title: isEnglish ? 'Piece Placement Rules' : '棋子放置規則',
              description: isEnglish
                ? '• Flag must be in the back row\n• Bombs and landmines cannot be in the front row\n• All pieces must be placed'
                : '• 軍旗必須在後排\n• 炸彈和地雷不能在前排\n• 所有棋子都必須放置',
            },
            {
              title: isEnglish ? 'Submit Your Board' : '提交您的棋盤',
              description: isEnglish
                ? 'Click "Send Board Placement" when all pieces are placed correctly.'
                : '當所有棋子都正確放置後，點擊「發送棋盤放置」。',
            },
          ],
        };
      case 2:
        return {
          title: isEnglish ? 'How to Play' : '如何遊戲',
          steps: [
            {
              title: isEnglish ? 'Making Moves' : '移動棋子',
              description: isEnglish
                ? 'Click on your piece to select it, then click on a valid destination. Click "Send move" to confirm.'
                : '點擊您的棋子選擇它，然後點擊有效目的地。點擊「發送移動」確認。',
            },
            {
              title: isEnglish ? 'Piece Hierarchy' : '棋子階級',
              description: isEnglish
                ? 'Higher rank pieces capture lower rank pieces. Equal ranks result in both pieces being destroyed.'
                : '高階棋子可以俘獲低階棋子。相同階級會導致兩個棋子都被摧毀。',
            },
            {
              title: isEnglish ? 'Special Rules' : '特殊規則',
              description: isEnglish
                ? '• Engineer can safely defuse landmines\n• Bombs destroy any attacking piece\n• Flag capture wins the game'
                : '• 工兵可以安全拆除地雷\n• 炸彈摧毀任何攻擊的棋子\n• 俘獲軍旗贏得遊戲',
            },
          ],
        };
      case 3:
        return {
          title: isEnglish ? 'Game Results' : '遊戲結果',
          steps: [
            {
              title: isEnglish ? 'Victory Conditions' : '勝利條件',
              description: isEnglish
                ? "Capture the opponent's flag to win, or force them to forfeit."
                : '俘獲對手的軍旗獲勝，或迫使他們投降。',
            },
            {
              title: isEnglish ? 'Game Statistics' : '遊戲統計',
              description: isEnglish
                ? 'View remaining and lost pieces for both players.'
                : '查看雙方玩家的剩餘和失去的棋子。',
            },
          ],
        };
      default:
        return {
          title: isEnglish ? 'Game Instructions' : '遊戲說明',
          steps: [],
        };
    }
  };

  const renderPieceCard = (piece) => (
    <Card key={piece.name} shadow="sm" padding="sm" radius="md" withBorder>
      <Group style={{ flexDirection: 'row', flexWrap: 'nowrap' }}>
        <ThemeIcon color="blue" variant="light" size={75}>
          {iconMap[piece.icon] || <IconQuestionMark size={75} />}
        </ThemeIcon>
        <Box>
          <Text fw={500}>{piece.name}</Text>
          <Text size="sm" c="dimmed">
            {piece.description}
          </Text>
          <Group gap="xs" mt="xs">
            <Badge color={piece.canMove ? 'green' : 'red'} size="sm">
              {piece.canMove ? 'Can Move' : 'Cannot Move'}
            </Badge>
            <Badge color={piece.canAttack ? 'green' : 'red'} size="sm">
              {piece.canAttack ? 'Can Attack' : 'Cannot Attack'}
            </Badge>
          </Group>
          {piece.special && (
            <Text size="xs" c="blue" mt="xs">
              {piece.special}
            </Text>
          )}
        </Box>
      </Group>
    </Card>
  );

  const phaseInstructions = getPhaseInstructions();

  return (
    <Modal opened={opened} onClose={onClose} title={phaseInstructions.title} size="xl" centered>
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
              {isEnglish ? 'Piece Reference' : '棋子參考'}
            </Title>
            <Grid>
              {pieceRules.map((piece, index) => (
                <Grid.Col span={6} key={`${piece.name}-${index}`}>
                  {renderPieceCard(piece)}
                </Grid.Col>
              ))}
            </Grid>
          </Box>
        )}

        {gamePhase === 0 && (
          <Alert icon={<IconHelp size={16} />} title="Quick Start" color="green">
            <Text size="sm">
              {isEnglish
                ? 'Welcome to Luzhanqi! Create or join a game to start playing.'
                : '歡迎來到陸戰棋！創建遊戲或與朋友一起加入開始遊戲。'}
            </Text>
          </Alert>
        )}

        <Group justify="right" mt="md">
          <Button variant="outline" onClick={onClose}>
            {isEnglish ? 'Close' : '關閉'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

Instructions.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  gamePhase: PropTypes.number,
  isEnglish: PropTypes.bool,
};

export default Instructions;
