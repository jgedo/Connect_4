class Connect4 {
    constructor (selector, rows, cols, playMode, bgColor, p1Color, p2Color, difficulty) {
        this.ROWS = rows;
        if (rows > 10) this.ROWS = 10;
        else if (rows < 4) this.ROWS = 4;

        this.COLS = cols;
        if (cols > 15) this.COLS = 15;
        else if (cols < 4) this.COLS = 4;
        
        this.selector = selector;
        this.playerTurn = 1; // 1 or 2
        this.score = 100000;
        this.playMode = playMode;

        this.difficulty = difficulty;
        if (difficulty > 8) this.difficulty = 8;
        else if (difficulty < 1) this.difficulty = 1;

        this.winningRow = [];

        // Background Color
        $('#container').css("background-color", bgColor);

        // Players Colors
        this.p1Color = p1Color;
        this.p2Color = p2Color;
        $(".loader").css("border-top", "10px solid " + this.p2Color);
        $("#turnText").css("color",this.p1Color);

        this.boardMap = [];
        this.fillBoardMap();
        this.createGameBoard();
        this.setupEventListeners();
    }

    initializeGame() {
        const $board = $(this.selector);
        $board.css("pointer-events","all");
        $("#connect4").html("");
        this.playerTurn = 1; // 1 or 2
        $("#turnText").css("color",this.p1Color);
        $("#turnText").html("Player One Turn");
        this.boardMap = [];
        this.fillBoardMap();
        this.createGameBoard();
    }

    fillBoardMap() {
        for (let row = 0; row < this.ROWS; row++) {
            const $row = $('<div>').addClass('row');
            let rowData = [];
            for (let col = 0; col < this.COLS; col++) {
                rowData.push(0);
            }
            this.boardMap.push(rowData);
        }
    }

    createGameBoard() {
        const $board = $(this.selector);
        for (let row = 0; row < this.ROWS; row++) {
            const $row = $('<div>').addClass('row');
            for (let col = 0; col < this.COLS; col++) {
                const $col = $('<div>').addClass("col empty")
                    .attr('data-col', col)
                    .attr('data-row', row);
                $row.append($col);
            }
            $board.append($row);
        }
    }

    checkGameState(initRow, initCol, playerTurn) {
        const connect4 = this;

        // Check horizontal
        // Right
        let row = initRow;
        let col = initCol + 1;
        let counter = 1;
        let otherCell = false;
        while (col < this.COLS && !otherCell) {
            if (this.boardMap[row][col] == playerTurn) {
                counter++;
                if (counter == 4) return true;
                col++;
            } else {
                otherCell = true;
            }
        }

        // Left
        col = initCol - 1
        otherCell = false;
        while (col >= 0 && !otherCell) {
            if (this.boardMap[row][col] == playerTurn) {
                counter++;
                if (counter == 4) return true;
                col--;
            } else {
                otherCell = true;
            }
        }

        // Check vertical
        // Down
        row = initRow + 1;
        col = initCol;
        counter = 1;
        otherCell = false;
        while (row < this.ROWS && !otherCell) {
            if (this.boardMap[row][col] == playerTurn) {
                counter++;
                if (counter == 4) return true;
                row++;
            } else {
                otherCell = true;
            }
        }

        // Up
        // We don't check upwards since it is impossible to have another coin above where we placed it

        // Check diagonal 1 top left - bottom right
        row = initRow + 1;
        col = initCol + 1;
        counter = 1;
        otherCell = false;
        while (row < this.ROWS && col < this.COLS && !otherCell) {
            if (this.boardMap[row][col] == playerTurn) {
                counter++;
                if (counter == 4) return true;
                row++;
                col++;
            } else {
                otherCell = true;
            }
        }

        row = initRow - 1;
        col = initCol - 1;
        otherCell = false;
        while (row >= 0 && col >= 0 && !otherCell) {
            if (this.boardMap[row][col] == playerTurn) {
                counter++;
                if (counter == 4) return true;
                row--;
                col--;
            } else {
                otherCell = true;
            }
        }

        // Check diagonal 2
        // bottom left - top right
        row = initRow - 1;
        col = initCol + 1;
        counter = 1;
        otherCell = false;
        while (row >= 0 && col < this.COLS && !otherCell) {
            if (this.boardMap[row][col] == playerTurn) {
                counter++;
                if (counter == 4) return true;
                row--;
                col++;
            } else {
                otherCell = true;
            }
        }

        row = initRow + 1;
        col = initCol - 1;
        otherCell = false;
        while (row < this.ROWS && col >= 0 && !otherCell) {
            if (this.boardMap[row][col] == playerTurn) {
                counter++;
                if (counter == 4) return true;
                row++;
                col--;
            } else {
                otherCell = true;
            }
        }

        return false;
    }

    checkIfDraw() {
        for (let j = 0; j < this.COLS; j++) {
            if (this.boardMap[0][j] == 0) return false;
        }
        return true;
    }

    isFinished(depth, score) {
        if (depth == 0 || score == this.score || score == -this.score || this.checkIfDraw()) {
            return true;
        } else {
            return false;
        }
    }

    calculatePositionScore(row, col, deltaRow, deltaCol) {
        let playerPoints = 0;
        let cpuPoints = 0;

        let humanArray = [];
        let cpuArray = [];

        for (let i = 0; i < 4; i++) {
            if (this.boardMap[row][col] == 1) {
                humanArray.push([row, col]);
                playerPoints++;
            } else if (this.boardMap[row][col] == 2) {
                cpuArray.push([row, col]);
                cpuPoints++;
            }

            row += deltaRow;
            col += deltaCol;
        }

        if (playerPoints == 4) {
            // Player has won
            this.winningRow = humanArray;
            return -this.score;
        } else if (cpuPoints == 4) {
            // CPU has won
            this.winningRow = cpuArray;
            return this.score;
        } else {
            return cpuPoints;
        }
    }

    calculateScore() {
        // Calculate possible score of current board (or calculated board)
        let points = 0;

        let vPoints = 0;
        let hPoints = 0;
        let d1Points = 0;
        let d2Points = 0;

        // Check all verticals
        for (let i = 0; i < this.ROWS - 3; i++) {
            for (let j = 0; j < this.COLS; j++) {
                let score = this.calculatePositionScore(i,j,1,0);
                if (score == this.score) return this.score;
                else if (score == -this.score) return -this.score;
                vPoints += score;
            }
        }

        // Check all horizontals
        for (let i = 0; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS - 3; j++) {
                let score = this.calculatePositionScore(i,j,0,1);
                if (score == this.score) return this.score;
                else if (score == -this.score) return -this.score;
                hPoints += score;
            }
        }

        // Check diagonal 1
        for (let i = 0; i < this.ROWS - 3; i++) {
            for (let j = 0; j < this.COLS - 3; j++) {
                let score = this.calculatePositionScore(i,j,1,1);
                if (score == this.score) return this.score;
                else if (score == -this.score) return -this.score;
                d1Points += score;
            }
        }

        // Check diagonal 2
        for (let i = 3; i < this.ROWS; i++) {
            for (let j = 0; j < this.COLS - 4; j++) {
                let score = this.calculatePositionScore(i,j,-1,1);
                if (score == this.score) return this.score;
                else if (score == -this.score) return -this.score;
                d2Points += score;
            }
        }

        points = hPoints + vPoints + d1Points + d2Points;
        return points;
    }

    maxiPlay(depth) {
        // Plays as CPU so looks forward to maximize the score of future moves
        let score = this.calculateScore();

        if (this.isFinished(depth, score)) {
            return {
                "col" : null,
                "value" : score
            }
        }

        let max = {
            "col" : null,
            "value" : -99999
        };

        // For all possible moves
        for (let i = 0; i < this.COLS; i++) {
            let row = null;
            for (let j=this.ROWS-1; j>=0; j--) {
                if (this.boardMap[j][i] == 0) {
                    row = j;
                    break;
                }
            }
            if (row == null) continue;
            this.boardMap[row][i] = 2;
            let minimaxResult = this.miniPlay(depth-1);
            if (max["col"] == null || minimaxResult["value"] > max["value"]) {
                max["col"] = i;
                max["value"] = minimaxResult["value"];
            }
            this.boardMap[row][i] = 0;
        }
        return max;
    }

    miniPlay(depth) {
        // Plays as Player so looks forward to minimize the score
        let score = this.calculateScore();

        if (this.isFinished(depth, score)) {
            return {
                "col" : null,
                "value" : score
            }
        }

        let min = {
            "col" : null,
            "value" : 99999
        };

        // For all possible moves
        for (let i = 0; i < this.COLS; i++) {
            let row = null;
            for (let j=this.ROWS-1; j>=0; j--) {
                if (this.boardMap[j][i] == 0) {
                    row = j;
                    break;
                }
            }
            if (row == null) continue;
            this.boardMap[row][i] = 1;
            let minimaxResult = this.maxiPlay(depth-1);
            if (min["col"] == null || minimaxResult["value"] < min["value"]) {
                min["col"] = i;
                min["value"] = minimaxResult["value"];
            }
            this.boardMap[row][i] = 0;
        }

        return min;
    }

    makeMovement() {
        // CPU plays
        let result = this.maxiPlay(this.difficulty);
        console.log(result["value"]);
        return result["col"];
    }

    markWinningRow() {
        this.calculateScore();
        for (let i = 0; i < this.winningRow.length; i++) {
            const cells = $(`.col[data-col="${this.winningRow[i][1]}"]`);
            const $cell = $(cells[this.winningRow[i][0]]);
            $cell.addClass('winCol');
        }
    }

    async cpuPlays() {
        const connect4 = this;
        const $board = $(this.selector);

        function lastEmptyCell(col) {
            const cells = $(`.col[data-col="${col}"]`);
            for (let i=cells.length-1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass("empty")) {
                    return $cell;
                }
            }
            return null;
        }

        // Get random column, if column is full get next available column
        //let col = Math.floor(Math.random()*connect4.COLS);
        //

        $board.css("pointer-events","none");

        $(".loader").css("display", "inline-block");

        let col;
        

        // Wait for a second, simulating CPU is thinking its movement
        let deciding = new Promise((resolve, reject) => {
            col = connect4.makeMovement()
            setTimeout(() => resolve("done!"), 1000)
        });

        await deciding;

        console.log("after deciding");

        while (lastEmptyCell(col) == null) {
            if (col >= connect4.COLS) {
                col = 0;
            } else {
                col++;
            }
        }

        const $lastEmptyCell = lastEmptyCell(col);

        $board.css("pointer-events","all");
        $(".loader").css("display", "none");

        $lastEmptyCell.removeClass('empty');
        connect4.boardMap[$lastEmptyCell.data('row')][$lastEmptyCell.data('col')] = connect4.playerTurn;
        //$lastEmptyCell.removeClass('placeholderTwo');
        $lastEmptyCell.addClass('playerTwo');
        $(".playerTwo").css('background-color',connect4.p2Color);
        if (connect4.checkGameState($lastEmptyCell.data('row'),$lastEmptyCell.data('col'), connect4.playerTurn)) {
            connect4.markWinningRow();
            $board.css("pointer-events","none");
            $("#winnerInfo").html("Player Two Wins!");
            $("#myModal").css("display", "block");
        } else if (connect4.checkIfDraw()) {
            $board.css("pointer-events","none");
            $("#winnerInfo").html("It's a draw!");
            $("#myModal").css("display", "block");
        } else {
            connect4.playerTurn = 1;
            $("#turnText").css("color",connect4.p1Color);
            $("#turnText").html("Player One Turn");
        }
    }

    setupEventListeners() {
        const connect4 = this;
        const $board = $(this.selector);

        function lastEmptyCell(col) {
            const cells = $(`.col[data-col="${col}"]`);
            for (let i=cells.length-1; i >= 0; i--) {
                const $cell = $(cells[i]);
                if ($cell.hasClass("empty")) {
                    return $cell;
                }
            }
            return null;
        }

        $board.on('mouseenter', '.col', function () {
            const col = $(this).data('col');
            const $lastEmptyCell = lastEmptyCell(col);
            
            if ($lastEmptyCell != null) {
                if (connect4.playerTurn == 1) {
                    $lastEmptyCell.addClass('placeholderOne');
                    $(".placeholderOne").css('background-color',connect4.p1Color);
                } else {
                    $lastEmptyCell.addClass('placeholderTwo');
                    $(".placeholderTwo").css('background-color',connect4.p2Color);
                }
            }
        });

        $board.on('mouseleave', '.col', function () {
            if (connect4.playerTurn == 1) {
                $('.col').removeClass('placeholderOne');
                $(".empty").css('background-color',"white");
            } else {
                $('.col').removeClass('placeholderTwo');
                $(".empty").css('background-color',"white");
            }
        })

        $board.on('click', '.col', function () {
            const col = $(this).data('col');
            const $lastEmptyCell = lastEmptyCell(col);
            if ($lastEmptyCell != null) {
                $lastEmptyCell.removeClass('empty');
                connect4.boardMap[$lastEmptyCell.data('row')][$lastEmptyCell.data('col')] = connect4.playerTurn;
                if (connect4.playerTurn == 1) {
                    $lastEmptyCell.removeClass('placeholderOne');
                    $lastEmptyCell.addClass('playerOne');
                    $(".playerOne").css('background-color',connect4.p1Color);
                    if (connect4.checkGameState($lastEmptyCell.data('row'),$lastEmptyCell.data('col'), connect4.playerTurn)) {
                        connect4.markWinningRow();
                        $board.css("pointer-events","none");
                        $("#winnerInfo").html("Player One Wins!");
                        $("#myModal").css("display", "block");
                    } else if (connect4.checkIfDraw()) {
                        $board.css("pointer-events","none");
                        $("#winnerInfo").html("It's a draw!");
                        $("#myModal").css("display", "block");
                    } else {
                        connect4.playerTurn = 2;
                        $("#turnText").css("color",connect4.p2Color);
                        $("#turnText").html("Player Two Turn");
                        if (connect4.playMode == 2) {
                            connect4.cpuPlays();
                        }
                    }
                } else {
                    $lastEmptyCell.removeClass('placeholderTwo');
                    $lastEmptyCell.addClass('playerTwo');
                    $(".playerTwo").css('background-color',connect4.p2Color);
                    if (connect4.checkGameState($lastEmptyCell.data('row'),$lastEmptyCell.data('col'), connect4.playerTurn)) {
                        connect4.markWinningRow();
                        $board.css("pointer-events","none");
                        $("#winnerInfo").html("Player Two Wins!");
                        $("#myModal").css("display", "block");
                    } else if (connect4.checkIfDraw()) {
                        $board.css("pointer-events","none");
                        $("#winnerInfo").html("It's a draw!");
                        $("#myModal").css("display", "block");
                    } else {
                        connect4.playerTurn = 1;
                        $("#turnText").css("color",connect4.p1Color);
                        $("#turnText").html("Player One Turn");
                    }
                }
            }
        })
    }
}
