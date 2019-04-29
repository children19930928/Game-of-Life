

		// 地图初始化
		for(var i = 0; i < scale; i++){
			cellMap[i] = [];
			cellMapTemp[i] = [];
			cellMapGuess[i] = [];
		}

		// 核心逻辑，判断细胞，存活返回1，死亡返回0
		function isSurvival(xCoord, yCoord){
			// 1.每个细胞的状态由该细胞及周围8个细胞上一次的状态所决定；
			// 2.如果一个细胞周围有3个细胞为生，则该细胞为生，即该细胞若原先为死则转为生，若原先为生则保持不变；
			// 3.如果一个细胞周围有2个细胞为生，则该细胞的生死状态保持不变；
			// 4.在其它情况下，该细胞为死，即该细胞若原先为生则转为死，若原先为死则保持不变。

			var xSmall = (xCoord == 0 )? scale-1 : (xCoord - 1);
			var xLarge = (xCoord + 1) % scale;
			var ySmall = (yCoord == 0 )? scale-1 : (yCoord - 1);
			var yLarge = (yCoord + 1) % scale;

			var surroundingSurvivor = cellMap[xSmall][ySmall] + cellMap[xCoord][ySmall] + cellMap[xLarge][ySmall] + cellMap[xSmall][yCoord] 
			+ cellMap[xLarge][yCoord] + cellMap[xSmall][yLarge] + cellMap[xCoord][yLarge] + cellMap[xLarge][yLarge];
			if((surroundingSurvivor == 3)||(surroundingSurvivor == 2 && cellMap[xCoord][yCoord] == 1))
				return 1;
			else
				return 0;
		}

		// 绘制出cellMap
		function showMap(){
			if(gameOn != 1)
				return;
			
			var canvas = document.getElementById('myCanvas');
			if (canvas.getContext) {
				var ctx = canvas.getContext('2d');
			    //console.log("generation");

			    priorSurvivalNum = curSurvivalNum;
			    curSurvivalNum = 0;

			    // 打印当前cellMap
			    ctx.clearRect(0,0,650,650);
			    for(var i = 0; i < scale; i++){
			    	for(var j = 0; j < scale; j++){
			    		if(cellMap[i][j] == 1){
			    			ctx.fillStyle = "rgba(125,125,255,0.7)";
			    			curSurvivalNum++;
			    		}
			    		else{
			    			ctx.fillStyle = "rgba(125,125,125,0.5)";
			    		}
						ctx.fillRect(i*unit+0.01*unit+25,j*unit+0.01*unit+25,unit-0.02*unit,unit-0.02*unit); //留白作为网格线
					}
				}

				//更新数据
				$(function(){
					$("#densityBar").css("width",curSurvivalNum/scale/scale*100 + '%');
					$("#densityBar").text(curSurvivalNum);

					var correctRate = (1-(errorNum/survivalNum))*10000;
					if(survivalNum == 0){	//下轮无人存活
						if(errorNum == 0)
							correctRate = 10000;
						else
							correctRate = 0;
					}
					else{
						if(correctRate < 0)	//防止有人乱点，错误数太多
							correctRate = 0;
						else
							correctRate = Math.floor(correctRate);
					}
					if(gameMode == 4)
						correctRate = 10000;
					$("#correctBar").css("width",correctRate/100 + '%');
					$("#correctBar").text(correctRate/100 + '%');

					correctRate = (1-(totalErrorNum/totalSurvivalNum))*10000;
					if(correctRate < 0)	//防止有人乱点，错误数太多
						correctRate = 0;
					else
						correctRate = Math.floor(correctRate);
					if(gameMode == 4)
						correctRate = 10000;
					$("#totalCorrectBar").css("width",correctRate/100 + '%');
					$("#totalCorrectBar").text(correctRate/100 + '%');

					$("#roundFrame").text(round++);
					$("#scaleFrame").text(scale + '*' + scale);	
					$("#periodFrame").text(period + ' s');
				})

				// 游戏模式下记录连续相同次数，重复则结束
				if(gameMode != 4){
					if(curSurvivalNum == priorSurvivalNum)
						sameSurvivalNum++;
					else
						sameSurvivalNum = 0;
					// 连续两轮存活数相同（前中后相同），游戏结束
					if(sameSurvivalNum == 2 || curSurvivalNum == 0){
						clearInterval(setinterval);
						$("#stopBtn").click();
						setinterval = 0;
					}
				}
			}
		}

		
		// 【初始设置】游戏开始调用
		// 各种初始值设定，需要根据模式来决定初始值
		function setMap(){
			clearInterval(setinterval);
			if(gameMode != 4){

				// 初始存活率0~1
				initialDensity = 0.5;
				// 规模1~100
				scale = 7;
				//不能模式难度设置
				if(gameMode == 1){
					period = 20;
				}
				else if(gameMode == 2){
					period = 10;
				}
				else{
					period = 5;
				}
			}

			// 先前存活个数
			priorSurvivalNum = -1;
			// 当前存活个数
			curSurvivalNum = 0;
			// 相同存活次数（两次则游戏结束）
			sameSurvivalNum = 0;
			// 轮数
			round = 0;
			// 总共存活个数
			totalSurvivalNum = 0;
			// 总共错误个数
			totalErrorNum = 0;
			// 单位格子的px值
			unit = 600.0 / scale; 


			for(var i = 0; i < scale; i++){
				cellMap[i] = [];
				cellMapTemp[i] = [];
				cellMapGuess[i] = [];
				for(var j = 0; j < scale; j++){
					if(Math.random() < initialDensity){
						cellMap[i][j] = 1;	
						cellMapTemp[i][j] = 1;	
						cellMapGuess[i][j] = 0;				
					}
					else{
						cellMap[i][j] = 0;
						cellMapTemp[i][j] = 0;	
						cellMapGuess[i][j] = 0;	
					}
				}
			}

			//绘制结果
			showMap();
		}

		// 【更新地图】游戏循环调用
		// 重新计算新的结果，游戏模式时与玩家猜测结果对比
		function updateMap(){
			survivalNum = 0;
			errorNum = 0;
			for(var i = 0; i < scale; i++){
				for(var j = 0; j < scale; j++){
					cellMapTemp[i][j] = isSurvival(i,j);

					if(cellMapTemp[i][j] == 1){
						survivalNum++;
						totalSurvivalNum++;
					}
					if(cellMapGuess[i][j] != cellMapTemp[i][j]){
						errorNum++;
						totalErrorNum++;
					}

					cellMapGuess[i][j] = 0;
				}
			}
			for(var i = 0; i < scale; i++){
				for(var j = 0; j < scale; j++){
					cellMap[i][j] = cellMapTemp[i][j];
				}
			}

			//绘制结果
			showMap();	
		}
		
		// 游戏开始前绘制【游戏规则】
		window.onload = function(){

			var canvas = document.getElementById('myCanvas');

			if (canvas.getContext) {

				var ctx = canvas.getContext('2d');

				// 设置填充颜色
				ctx.fillStyle = "#000000"; 
				// 设置对齐方式
				ctx.textAlign = "left";

				// 设置字体
				ctx.font = "Bold 50px broadway";
				// 设置字体内容，以及在画布上的位置
				ctx.fillText("GAME OF LIFE", 120, 80);


				// 设置字体
				ctx.font = "Bold 20px 楷体";
				// 设置字体内容，以及在画布上的位置
				ctx.fillText("欢迎来到【细胞自动机游戏】！", 100, 130);
				ctx.fillText("您需要在固定时间内找出下一轮的存活细胞。", 100, 160);
				ctx.fillText("==============================================", 100, 190);
				ctx.fillText("规则如下：", 100, 220);
				ctx.fillText("1.细胞状态由该细胞及周围8个细胞上次状态决定；", 100, 250);
				ctx.fillText("2.若细胞周围有3个细胞为生，则该细胞必定为生；", 100, 280);
				ctx.fillText("3.若细胞周围有2个细胞为生，则该细胞状态保持；", 100, 310);
				ctx.fillText("4.在其它情况下（1, 4~ 8），则该细胞必定为死。", 100, 340);
				ctx.fillText("==============================================", 100, 370);
				ctx.fillText("tips：按到键盘可以直接跳到下个周期", 100, 410);
				ctx.fillText("此外，您也可以选择自定义模式，自行定义细胞规模、", 100, 480);
				ctx.fillText("细胞周期和细胞初始存活率，纯观赏来领略其中奥妙。", 100, 510);


				// 设置字体
				ctx.font = "Bold 30px 华文行楷"; 
				// 设置字体内容，以及在画布上的位置
				ctx.fillText("邱泓钧  张佳瑜", 350, 600);
			}
		}


		