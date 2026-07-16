import React, { useContext, useEffect } from 'react';
import { Button, Checkbox, Container, CopyButton, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { GameContext } from 'contexts/GameContext';
import { ToastContainer, toast } from 'react-toastify';
import { useFirebaseAuth } from 'contexts/FirebaseContext';

const Lobby = () => {
  const {
    socket,
    roomId: { roomId },
    joinCode: { joinCode },
    playerName: { playerName },
    playerList: { playerList },
    spectatorName: { spectatorName },
    spectatorList: { spectatorList },
    host: { host },
    joinedGame: { joinedGame },
    errors: { errors, setErrors },
    isEnglish: { isEnglish },
  } = useContext(GameContext);

  const user = useFirebaseAuth();
  const configForm = useForm({
    initialValues: {
      fogOfWar: true,
      landminesSurvive: false,
      flyingBombs: false,
      captureTheFlag: false,
    },
  });

  /** Clear errors after 1 second each */
  useEffect(() => {
    errors.forEach((error) => {
      toast.error(error, {
        toastId: `${Date.now()}`,
      });
    });
    setErrors([]);
  }, [JSON.stringify(errors), toast.error]);

  /** Tell server to begin game */
  const roomFull = (gameConfig) => {
    // the game requires two players to begin
    if (playerList.length >= 2) {
      socket.emit('hostRoomFull', roomId, gameConfig);
    } else {
      setErrors((prevErrors) => [
        ...prevErrors,
        isEnglish ? 'There must be two players in the lobby' : '大廳中必須有兩名玩家',
      ]);
    }
  };

  const playerLeaveRoom = async () => {
    socket.emit('playerLeaveRoom', {
      playerName,
      idToken: user ? await user.getIdToken() : null,
      leaveRoomId: roomId,
    });
  };

  const spectatorLeaveRoom = async () => {
    socket.emit('spectatorLeaveRoom', {
      spectatorName,
      idToken: user ? await user.getIdToken() : null,
      leaveRoomId: roomId,
    });
  };

  const memberLeaveRoom = () => {
    if (spectatorList.includes(spectatorName)) {
      spectatorLeaveRoom();
    } else {
      playerLeaveRoom();
    }
  };

  return (
    <Container style={{ backgroundColor: '#d0edf5' }}>
      {joinCode ? (
        <Container style={{ display: 'flex', alignItems: 'center', gap: '0.5em', padding: 0 }}>
          <Text size="md">{isEnglish ? 'Room code:' : '房間代碼：'}</Text>
          <Text size="xl" weight={700} sx={{ fontFamily: 'monospace', letterSpacing: '0.15em' }}>
            {joinCode}
          </Text>
          <CopyButton value={joinCode}>
            {({ copied, copy }) => (
              <Button size="xs" color={copied ? 'green' : 'blue'} onClick={copy}>
                {isEnglish ? (copied ? 'Copied' : 'Copy') : copied ? '已複製' : '複製'}
              </Button>
            )}
          </CopyButton>
        </Container>
      ) : null}
      {
        /** You have joined the game and are waiting for the host to start */
        joinedGame && !host ? (
          <>
            {isEnglish ? (
              <Title order={3}>Waiting for the host</Title>
            ) : (
              <Title order={3}>請等主持人</Title>
            )}
            <Button variant="outline" color="red" onClick={memberLeaveRoom}>
              {isEnglish ? 'Leave Room' : '離開房間'}
            </Button>
          </>
        ) : null
      }

      {
        /** Give host ability to start game */
        host ? (
          <>
            {isEnglish ? (
              <Title order={3}>Click &quot;Room Full&quot; to begin the game</Title>
            ) : (
              <Title order={3}>點擊「房間已滿」開始遊戲</Title>
            )}
            <Container style={{ display: 'flex', gap: '0.5em' }}>
              <Button
                variant="filled"
                color="green"
                onClick={() => roomFull(configForm.values)}
                style={{ width: '8em' }}
              >
                {isEnglish ? 'Room Full' : '房間已滿'}
              </Button>
              <Button variant="outline" color="red" onClick={playerLeaveRoom}>
                {isEnglish ? 'Delete Room' : '刪除房間'}
              </Button>
            </Container>
            <Title order={4}>{isEnglish ? 'Rules' : '規則'}</Title>
            <form>
              <Checkbox
                mt="md"
                label={isEnglish ? 'Enable fog of war' : '啟用戰爭迷霧'}
                {...configForm.getInputProps('fogOfWar', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={
                  isEnglish
                    ? 'Landmines survive (only the attacker dies)'
                    : '地雷不會被摧毀（只有攻擊方陣亡）'
                }
                {...configForm.getInputProps('landminesSurvive', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={
                  isEnglish
                    ? 'Flying bombs (bombs move like the Engineer)'
                    : '飛彈（炸彈可像工兵一樣轉彎移動）'
                }
                {...configForm.getInputProps('flyingBombs', { type: 'checkbox' })}
              />
              <Checkbox
                mt="sm"
                label={
                  isEnglish
                    ? 'Capture the flag (carry it back to your HQ to win)'
                    : '奪旗規則（需將軍旗帶回己方大本營才能獲勝）'
                }
                {...configForm.getInputProps('captureTheFlag', { type: 'checkbox' })}
              />
            </form>
          </>
        ) : null
      }

      <ToastContainer />
    </Container>
  );
};

export default Lobby;
