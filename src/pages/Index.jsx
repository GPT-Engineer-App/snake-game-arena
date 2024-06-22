import React, { useState, useEffect, useCallback } from 'react';
import { Box, Flex, Text, Button, VStack } from '@chakra-ui/react';

const SNAKE_SPEED = 200;
const BOARD_SIZE = 20;

const getRandomFoodPosition = () => {
  const x = Math.floor(Math.random() * BOARD_SIZE);
  const y = Math.floor(Math.random() * BOARD_SIZE);
  return { x, y };
};

const Index = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState(getRandomFoodPosition());
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'ArrowUp':
        setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        setDirection({ x: 1, y: 0 });
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFoodPosition());
          setScore((prevScore) => prevScore + 1);
        } else {
          newSnake.pop();
        }

        if (
          head.x < 0 ||
          head.x >= BOARD_SIZE ||
          head.y < 0 ||
          head.y >= BOARD_SIZE ||
          newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);
        return newSnake;
      });
    }, SNAKE_SPEED);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const handleRestart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomFoodPosition());
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
  };

  return (
    <Flex direction="column" align="center" justify="center" height="100vh">
      <Text fontSize="2xl" mb={4}>Snake Game</Text>
      <Box position="relative" width="400px" height="400px" border="1px solid black">
        {snake.map((segment, index) => (
          <Box key={index} position="absolute" width="20px" height="20px" bg="green" style={{ left: segment.x * 20, top: segment.y * 20 }} />
        ))}
        <Box position="absolute" width="20px" height="20px" bg="red" style={{ left: food.x * 20, top: food.y * 20 }} />
      </Box>
      <VStack spacing={4} mt={4}>
        <Text>Score: {score}</Text>
        {gameOver && <Text color="red.500">Game Over</Text>}
        <Button onClick={handleRestart}>Restart</Button>
      </VStack>
    </Flex>
  );
};

export default Index;