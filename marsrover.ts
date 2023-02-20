type RobotOrientation = "N" | "E" | "S" | "W";

type Robot = {
  x: number;
  y: number;
  orientation: RobotOrientation;
  commands: string;
};

function moveRobots(
  gridWidth: number,
  gridHeight: number,
  robots: Robot[]
): string {
  const movements = {
    N: { x: 0, y: 1 },
    E: { x: 1, y: 0 },
    S: { x: 0, y: -1 },
    W: { x: -1, y: 0 },
  };

  return robots
    .map((robot) => {
      if (
        robot.x < 0 ||
        robot.y < 0 ||
        robot.x > gridWidth ||
        robot.y > gridHeight
      ) {
        return "Robot does not begin on grid";
      }

      for (const command of robot.commands) {
        switch (command) {
          case "L":
            switch (robot.orientation) {
              case "N":
                robot.orientation = "W";
                break;
              case "E":
                robot.orientation = "N";
                break;
              case "S":
                robot.orientation = "E";
                break;
              case "W":
                robot.orientation = "S";
                break;
            }
            break;
          case "R":
            switch (robot.orientation) {
              case "N":
                robot.orientation = "E";
                break;
              case "E":
                robot.orientation = "S";
                break;
              case "S":
                robot.orientation = "W";
                break;
              case "W":
                robot.orientation = "N";
                break;
            }
            break;

          case "F":
            const movement = movements[robot.orientation];
            const newX = robot.x + movement.x;
            const newY = robot.y + movement.y;

            if (newX < 0 || newY < 0 || newX > gridWidth || newY > gridHeight)
              return `(${robot.x}, ${robot.y}, ${robot.orientation}) LOST`;

            robot.x = newX;
            robot.y = newY;

            break;
        }
      }
      return `(${robot.x}, ${robot.y}, ${robot.orientation})`;
    })
    .join("\n");
}

function runRobotCommands(commands: string): string {
  if (commands.length === 0) {
    return "Invalid commands";
  }

  const [gridSize, ...robotConfigs] = commands.split("\n");
  const [maxX, maxY] = gridSize.split(" ").map(Number);
  if (maxX < 0 || maxY < 0) {
    return "Invalid grid size";
  }

  const robots: Robot[] = [];
  robotConfigs.forEach((config) => {
    const initialPos = config.slice(1, config.indexOf(")"));
    const coordinatesString = initialPos.replace("(", "").replace(")", "");
    const [robotX, robotY, direction] = coordinatesString
      .split(",")
      .map((value) => {
        return value.trim();
      });
    const commands = config
      .slice(config.indexOf(")") + 1, config.length)
      .trim();

    robots.push({
      x: Number(robotX),
      y: Number(robotY),
      orientation: direction as RobotOrientation,
      commands,
    });
  });

  return moveRobots(maxX, maxY, robots);
}

// Tests
const tests = [
  {
    command: `4 8
(2, 3, E) LFRFF
(0, 2, N) FFLFRFF`,
    expected: `(4, 4, E)
(0, 4, W) LOST`,
    result: false,
  },
  {
    command: `4 8
(2, 3, N) FLLFR
(1, 0, S) FFRLF`,
    expected: `(2, 3, W)
(1, 0, S) LOST`,
    result: false,
  },
  {
    command: ``,
    expected: `Invalid commands`,
    result: false,
  },
  {
    command: `-2 1`,
    expected: `Invalid grid size`,
    result: false,
  },
  {
    command: `4 8
(2, 9, E) LFRFF
(0, -1, N) FFLFRFF`,
    expected: `Robot does not begin on grid
Robot does not begin on grid`,
    result: false,
  },
];

const testResults = tests.map((test) => {
  const ranTest = runRobotCommands(test.command);
  test.result = ranTest === test.expected;
  return test;
});

console.table(testResults);
