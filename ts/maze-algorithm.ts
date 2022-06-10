type Matrix = Array<Array<number>>
/*
假设有一个迷宫，左上角是入口，右下角是出口，有路径从入口到出口，路径不确定。
寻路流程可将每一步拆分为单独的寻路过程：
向下寻路，如果可以向前则继续寻路
不能向下，则回退到向下寻路之前的位置上
向右寻路，可以则继续寻路
向右也不能往前走，则找不到路径

实现：
利用递归分治每一步寻路，组合所有能够往前的位置得到最终出路
 */

/**
 * 判断位置是否能够往前走（在迷宫内，且值不为0）
 * @param {Matrix} maze 迷宫矩阵
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
const isSafe = (maze: Matrix, x: number, y: number) => {
  const xLen = maze.length
  const yLen = maze[0].length
  return x >= 0 && y >= 0 && x < xLen && y < yLen && !!maze[x][y]
}

/**
 * 寻找迷宫正确的出路
 * @param {T} wayout 路径矩阵
 * @param {number} x
 * @param {number} y
 * @param {T} mzae 迷宫矩阵
 * @returns {boolean}
 */
function findWay<T extends Matrix> (wayout: T, x: number, y: number, maze: T): boolean {
  const xLen = maze.length
  const yLen = maze[0].length
  // 当位置移动到右下角就是当前递归的出口
  if (x === xLen - 1 && y === yLen - 1) {
    wayout[x][y] = 1
    return true
  }
  // 当前位置能够往前移动则往前寻路
  if (isSafe(maze, x, y)) {
    wayout[x][y] = 1
    // 往下寻路
    if (findWay(wayout, x, y + 1, maze)) {
      return true
    }
    // 往右边寻路
    if (findWay(wayout, x + 1, y, maze)) {
      return true
    }
    wayout[x][y] = 0
  }
  // 返回false表明要回退
  return false
}

function mazeWayOut<T extends Matrix> (maze: T): T | string {
  const wayOut: T = <T>[]

  // 初始化出路矩阵
  for (let i = maze.length - 1; i >= 0; i--) {
    wayOut[i] = []
    for (let j = maze[i].length - 1; j >= 0; j--) {
      wayOut[i][j] = 0
    }
  }

  if (findWay(wayOut, 0, 0, maze)) {
    return wayOut
  }

  return 'no way found'
}
