/*
数独是一个非常有趣的解谜游戏，也是史上最流行的游戏之一。
规则是根据9×9盘面上的已知数字，推理出所有剩余空格的数字，并满足以下条件：
每一行、每一列、每一个粗线宫（3*3）内的数字均含1-9，不重复

解题步骤（递归思想，将每一个空白位置的解看做是当前位置的解和下一个空白位置的解的结合）：
1.找到逐行找空白位置（矩阵中值为0）
  a.能够找到空白位置，则代表还需要继续解题
  b.不能够找到空白位置，则代表数独已经解开，返回即可
2.在空白位置根据规则穷举数字0-9，并记录到空白位置
3.继续往下一个空白位置穷举（走到步骤1）
4.下一个空白位置能够穷举则返回下一个空白位置的解
5.不能则回退到记录之前的值（步骤2）
 */
type Matrix = Array<Array<number>>

// 每一行不能有重复数字
function rowSafe (sudoku: Matrix, row: number, n: number) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[row][i] === n) {
      return false
    }
  }
  return true
}

// 每一列不能有重复数字
function columnsSafe (sudoku: Matrix, columns: number, n: number) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[i][columns] === n) {
      return false
    }
  }
  return true
}

// 每个宫格不能有重复
function latticeSafe (sudoku: Matrix, columns: number, row: number, n: number) {
  const colNum = ~~(columns / 3)
  const rowNum = ~~(row / 3)
  for (let i = rowNum * 3; i < (rowNum + 1) * 3; i++) {
    for (let j = colNum * 3; j < (colNum + 1) * 3; j++) {
      if (sudoku[i][j] === n) return false
    }
  }
  return true
}

function ableToPlace (sudoku: Matrix, row: number, columns: number, num: number) {
  return rowSafe(sudoku, row, num) && columnsSafe(sudoku, columns, num) && latticeSafe(sudoku, columns, row, num)
}

// 寻找数独矩阵中空白的（值是0）位置
function findBlank (sudoku: Matrix) {
  let row: number = 0
  let columns: number = 0
  let blankSpaces = false
  while (row <= 8 && columns <= 8) {
    if (!sudoku[row][columns]) {
      blankSpaces = true
      break
    }
    if (++columns > 8) {
      row++
      columns = 0
    }
  }

  return {row, columns, blankSpaces}
}

function sudokuSolver (sudoku: Matrix) {
  const {row, columns, blankSpaces} = findBlank(sudoku)
  // 如果没有空位置，则代表数独已经被解开
  if (!blankSpaces) {
    return true
  }
  /* 核心代码开始 */
  // 找到空白位置，并穷举数字1-9，看是否是空白位置的解
  for (let i = 1; i <= 9; i++) {
    if (ableToPlace(sudoku, row, columns, i)) {
      // 是空白位置的解则记录，并继续求解
      sudoku[row][columns] = i
      if (sudokuSolver(sudoku)) {
        return true
      }
      // 如果数字最总不能求解，则回退（关键代码）
      sudoku[row][columns] = 0
    }
  }
  /* 核心代码结束 */
  return false
}

function sudoku (sudoku: Matrix) {
  if (sudokuSolver(sudoku)) {
    return sudoku
  }
  return 'no solution'
}
