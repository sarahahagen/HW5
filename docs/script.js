/*
    Name: Sarah Hagen
    Class: CPSC 332
    Assignment: Homework 5
    Last Modified Date: 11/08/2022
*/

var color1 = "#0095DD";

        window.onload = function () {
            var canvas = document.getElementById("myCanvas");
            var ctx = canvas.getContext("2d");
            var ballRadius = 10;
            var x = canvas.width / 2;
            var y = canvas.height - 30;
            var dx = 2;
            var dy = -2;
            var paddleHeight = 10;
            var paddleWidth = 75;
            var paddleX = (canvas.width - paddleWidth) / 2;
            var rightPressed = false;
            var leftPressed = false;
            var brickRowCount = 5;
            var brickColumnCount = 3;
            var brickWidth = 75;
            var brickHeight = 20;
            var brickPadding = 10;
            var brickOffsetTop = 30;
            var brickOffsetLeft = 30;
            var score = 0;
            var lives = 3;

            var bricks = [];

            for (var c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (var r = 0; r < brickRowCount; r++) {
                    bricks[c][r] = { x: 0, y: 0, status: 1 };
                }
            }

            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            document.addEventListener("mousemove", mouseMoveHandler, false);

            function keyDownHandler(e) {
                if (e.keyCode == 39) {
                    rightPressed = true;
                }
                else if (e.keyCode == 37) {
                    leftPressed = true;
                }
            }

            function keyUpHandler(e) {
                if (e.keyCode == 39) {
                    rightPressed = false;
                }
                else if (e.keyCode == 37) {
                    leftPressed = false;
                }
            }

            function mouseMoveHandler(e) {
                var relativeX = e.clientX - canvas.offsetLeft;
                if (relativeX > 0 && relativeX < canvas.width) {
                    paddleX = relativeX - paddleWidth / 2;
                }
            }

            function collisionDetection() {
                for (var c = 0; c < brickColumnCount; c++) {
                    for (var r = 0; r < brickRowCount; r++) {
                        var b = bricks[c][r];
                        if (b.status == 1) {
                            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                                dy = -dy;
                                b.status = 0;
                                score++;
                                if (score == brickRowCount * brickColumnCount) {
                                    //TODO: draw message on the canvas
                                    ctx.font = "30px Arial";
                                    ctx.fillStyle = "purple";
                                    ctx.fillText("You Win! Congrats!", canvas.height - 190, canvas.width - 275);
                                    //TODO: pause game instead of reloading
                                    document.window.setTimeout("", 60000);
                                    //document.location.reload();
                                }
                            }
                        }
                    }
                }
            }

            function drawBall() {
                ctx.beginPath();
                ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
                ctx.fillStyle = color1;
                ctx.fill();
                ctx.closePath();
            }

            function drawPaddle() {
                ctx.beginPath();
                ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
                ctx.fillStyle = color1;
                ctx.fill();
                ctx.closePath();
            }

            function drawBricks() {
                for (var c = 0; c < brickColumnCount; c++) {
                    for (var r = 0; r < brickRowCount; r++) {
                        if (bricks[c][r].status == 1) {
                            var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                            var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                            bricks[c][r].x = brickX;
                            bricks[c][r].y = brickY;
                            ctx.beginPath();
                            ctx.rect(brickX, brickY, brickWidth, brickHeight);
                            ctx.fillStyle = color1;
                            ctx.fill();
                            ctx.closePath();
                        }
                    }
                }
            }
            function drawScore() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Score: " + score, 60, 20);
            }

            function drawLives() {
                ctx.font = "16px Arial";
                ctx.fillStyle = color1;
                ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
            }

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawMenu();
                drawBricks();
                drawBall();
                drawPaddle();
                drawScore();
                drawHighScore();
                drawLives();
                collisionDetection();

                if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                    dx = -dx;
                }
                if (y + dy < ballRadius) {
                    dy = -dy;
                }
                else if (y + dy > canvas.height - ballRadius) {
                    if (x > paddleX && x < paddleX + paddleWidth) {
                        dy = -dy;
                    }
                    else {
                        lives--;
                        if (lives <= 0) {
                            //TODO: draw message on the canvas
                            ctx.font = "30px Arial";
                            ctx.fillStyle = "red";
                            ctx.fillText("Sorry! Game Over!", canvas.height - 190, canvas.width - 275);
                            //TODO: pause game instead of reloading
                            document.window.setTimeout("", 60000);
                            //document.location.reload();
                        }
                        else {
                            x = canvas.width / 2;
                            y = canvas.height - 30;
                            dx = 3;
                            dy = -3;
                            paddleX = (canvas.width - paddleWidth) / 2;
                        }
                    }
                }

                if (rightPressed && paddleX < canvas.width - paddleWidth) {
                    paddleX += 7;
                }
                else if (leftPressed && paddleX > 0) {
                    paddleX -= 7;
                }
               
                adjustGameSpeed();
                requestAnimationFrame(draw);
            }

            /*
                Additions to starter code
            */

            //Additional variables used to help make dimensions/locations easier to reuse            
            //controls game speed     
            //pause game variable     
            //high score tracking variables
            var highScore = 0;
            //other variables?            

            //event listeners added
            //game speed changes handler    
            document.getElementById("slider").addEventListener("input", adjustGameSpeed);        
            //pause game event handler          
            document.getElementById("pause-button").addEventListener("click", togglePauseGame);          
            //start a new game event handler   
            document.getElementById("reset-button").addEventListener("click", startNewGame(score));          
            //continue playing
            document.getElementById("continue-button").addEventListener("click", continuePlaying);          
            //reload click event listener            
            document.getElementById("reload-button").addEventListener("click", drawMenu);  

            //Drawing a high score
            function drawHighScore() {
                ctx.font = "bold 16px Arial";
                ctx.fillStyle = "black";
                ctx.fillText("High Score: " + score, canvas.height - 120, canvas.width - 460);
                if (score >= highScore) {
                    highScore = score;
                }
            }

            //draw the menu screen, including labels and button
            function drawMenu() {
                //draw the rectangle menu backdrop
                ctx.fillStyle = "yellow";
                ctx.fillRect(0, 0, 500, 500);

                //draw the menu header
                ctx.shadowBlur = 15;
                ctx.shadowOffsetX = 10;
                ctx.shadowOffsetY = 5;
                ctx.shadowColor = "black";
                ctx.fillStyle = "green";
                ctx.fillRect(15, 10, 450, 300);

                ctx.font = "32px Arial";
                ctx.fillStyle = "black";
                ctx.textBaseline = "top";
                ctx.fillText("Breakout Game!", canvas.height - 200, canvas.width - 425);

                //start game button area
                ctx.shadowOffsetX = 10;
                ctx.shadowOffsetY = 5;
                ctx.shadowColor = "black";
                ctx.fillStyle = "red";
                ctx.fillRect(130, 100, 175, 70);
                
                ctx.font = "26px Arial";
                ctx.fillStyle = "black";
                ctx.textBaseline = "top";
                ctx.fillText("Start Game", canvas.width - 325, canvas.height - 200);

                //event listener for clicking start
                //need to add it here because the menu should be able to come back after 
                //we remove the it later                
            }

            //function used to set shadow properties
            function setShadow() {

            };

            //function used to reset shadow properties to 'normal'
            function resetShadow() {

            };

            //function to clear the menu when we want to start the game
            function clearMenu() {
                //remove event listener for menu,
                //we don't want to trigger the start game click event during a game   
            }

            //function to start the game
            //this should check to see if the player clicked the button
            //i.e., did the user click in the bounds of where the button is drawn
            //if so, we want to trigger the draw(); function to start our game
            function startGameClick(event) {

            };

            //function to handle game speed adjustments when we move our slider
            function adjustGameSpeed() {
                var speed = document.getElementById("slider").value;
                //update the slider display
                document.getElementById("speed").innerHTML = "Game Speed: " + speed;
                //update the game speed multiplier 
                x += dx * speed;
                y += dy * speed;
            };

            //function to toggle the play/paused game state
            function togglePauseGame() {
                //toggle state                
                //if we are not paused, we want to continue animating (hint: zyBook 8.9)
            };

            //function to check win state
            //if we win, we want to accumulate high score and draw a message to the canvas
            //if we lose, we want to draw a losing message to the canvas
            function checkWinState() {

            };

            //function to clear the board state and start a new game (no high score accumulation)
            function startNewGame(resetScore) {
                draw();
            };

            //function to reset the board and continue playing (accumulate high score)
            //should make sure we didn't lose before accumulating high score
            function continuePlaying() {
                highScore = 15;
                score = 0;
            };

            //function to reset starting game info
            function resetBoard(resetLives) {
                //reset paddle position
                drawPaddle();
                //reset bricks        
                drawBricks();
                //reset score and lives 
                score = 0;
                highScore = 0;
                drawScore();
                lives = 3;  
                drawLives();            
            };

            //draw the menu.
            //we don't want to immediately draw... only when we click start game            
            draw();

        };//end window.onload function
