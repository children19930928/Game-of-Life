		
		/****************************************************************************************************************************/
		/*******************************************************选择游戏模式 gameMode************************************************/
		/****************************************************************************************************************************/
		// 1.前三种为游戏模式选择，不能暂停。第四个为观赏模式，可以暂停。
		// 2.游戏进行时不能更改游戏模式
		// 3.选中时对应游戏模式为浅蓝色info，其他为白色default。
		// 4.选中对应模式后，更新右下侧数据。
		// 5.游戏未开始前，无法点击暂停和停止。

		//模式一，简单模式。gameMode=1
		$("#easyBtn").click(function() {
			if(gameOn != 0)
				return;
			if(gameMode == 1){
				
			}
			else if(gameMode == 2){
				$("#middleBtn").removeClass("btn-info");
				$("#middleBtn").addClass("btn-default");
			}
			else if(gameMode == 3){
				$("#hardBtn").removeClass("btn-info");
				$("#hardBtn").addClass("btn-default");
			}
			else if(gameMode == 4){
				$("#customBtn").removeClass("btn-info");
				$("#customBtn").addClass("btn-default");
			}
			$("#easyBtn").addClass("btn-info");
			$("#pauseBtn").attr("disabled",true);
			$("#stopBtn").attr("disabled",true);
			gameMode = 1;
			$("#scaleFrame").text("7*7");	
			$("#periodFrame").text('20 s');
		});
		//模式二，中等模式。gameMode=2
		$("#middleBtn").click(function() {
			if(gameOn != 0)
				return;

			if(gameMode == 1){
				$("#easyBtn").removeClass("btn-info");
				$("#easyBtn").addClass("btn-default");
			}
			else if(gameMode == 2){
				
			}
			else if(gameMode == 3){
				$("#hardBtn").removeClass("btn-info");
				$("#hardBtn").addClass("btn-default");
			}
			else if(gameMode == 4){
				$("#customBtn").removeClass("btn-info");
				$("#customBtn").addClass("btn-default");
			}
			$("#middleBtn").addClass("btn-info");
			$("#pauseBtn").attr("disabled",true);
			$("#stopBtn").attr("disabled",true);
			gameMode = 2;
			$("#scaleFrame").text("7*7");	
			$("#periodFrame").text('10 s');
		});
		//模式三，困难模式。gameMode=3
		$("#hardBtn").click(function() {
			if(gameOn != 0)
				return;

			if(gameMode == 1){
				$("#easyBtn").removeClass("btn-info");
				$("#easyBtn").addClass("btn-default");
			}
			else if(gameMode == 2){
				$("#middleBtn").removeClass("btn-info");
				$("#middleBtn").addClass("btn-default");
			}
			else if(gameMode == 3){
				
			}
			else if(gameMode == 4){
				$("#customBtn").removeClass("btn-info");
				$("#customBtn").addClass("btn-default");
			}
			$("#hardBtn").addClass("btn-info");

			$("#pauseBtn").attr("disabled",true);
			$("#stopBtn").attr("disabled",true);
			gameMode = 3;
			$("#scaleFrame").text("7*7");	
			$("#periodFrame").text('5 s');
		});
		//模式四，自定义模式。gameMode=4
		$("#customBtn").click(function() {
			if(gameOn != 0)
				return;
			if(gameMode == 1){
				$("#easyBtn").removeClass("btn-info");
				$("#easyBtn").addClass("btn-default");
			}
			else if(gameMode == 2){
				$("#middleBtn").removeClass("btn-info");
				$("#middleBtn").addClass("btn-default");
			}
			else if(gameMode == 3){
				$("#hardBtn").removeClass("btn-info");
				$("#hardBtn").addClass("btn-default");
			}
			else if(gameMode == 4){
				
			}
			$("#customBtn").addClass("btn-info");
			$("#pauseBtn").attr("disabled",true);
			$("#stopBtn").attr("disabled",true);
			gameMode = 4;
			$("#scaleFrame").text($("#customScaleTxt").val() + '*' + $("#customScaleTxt").val());	
			$("#periodFrame").text($("#customPeriodTxt").val() + ' s');
		});
		// 自定模式保存结果，及时更新右下侧资料
		$("#customSaveBtn").click(function() {
			scale = $("#customScaleTxt").val();
			period = $("#customPeriodTxt").val();
			initialDensity = $("#customDensityTxt").val();
			$("#roundFrame").text(round);
			$("#scaleFrame").text(scale + '*' + scale);	
			$("#periodFrame").text(period + ' s');
		});

		/****************************************************************************************************************************/
		/*********************************************************游戏进程按钮 gameOn************************************************/
		/****************************************************************************************************************************/

		//【开始】按钮
		// 点击开始后，名称改成重启，再次点击则重新开始。
		// 点击开始后，游戏模式不能更改。
		$("#startBtn").click(function() {

			gameOn = 1;
			$("#easyBtn").attr("disabled",true);
			$("#middleBtn").attr("disabled",true);
			$("#hardBtn").attr("disabled",true);
			$("#customBtn").attr("disabled",true);

			//只有观赏模式才能暂停
			if(gameMode == 4)
				$("#pauseBtn").attr("disabled",false);
			else
				$("#pauseBtn").attr("disabled",true);
			$("#stopBtn").attr("disabled",false);
			$("#startBtn").text('重启');
			setMap();

			setinterval = setInterval("updateMap()", period*1000);
		});

		//【暂停】按钮
		// 点击后更新暂停，按钮改成继续。
		// 点击继续按钮，更新继续进行。
		$("#pauseBtn").click(function() {
			//进行->暂停
			if(gameOn == 1){
				gameOn = 0.5;
				clearInterval(setinterval);
				$("#pauseBtn").text('继续');
			}
			//暂停->继续
			else if(gameOn == 0.5){
				gameOn = 1;
				setinterval = setInterval("updateMap()", period*1000);
				$("#pauseBtn").text('暂停');
			}
		});

		//【停止】按钮
		// 点击停止后，游戏终止。游戏模式可以重新选择。
		// 点击停止后，暂停和停止不能点击，只能点击开始。
		$("#stopBtn").click(function() {
			gameOn = 0;
			$("#easyBtn").attr("disabled",false);
			$("#middleBtn").attr("disabled",false);
			$("#hardBtn").attr("disabled",false);
			$("#customBtn").attr("disabled",false);
			$("#pauseBtn").attr("disabled",true);
			$("#stopBtn").attr("disabled",true);
			$("#startBtn").text('开始');
			$("#pauseBtn").text('暂停');
			clearInterval(setinterval);
		});
		
		/****************************************************************************************************************************/
		/****************************************************************网格点击系统************************************************/
		/****************************************************************************************************************************/

		//双击后游戏跳过本回合
		$("#myCanvas").dblclick(function() {
			
		});

		$("#myCanvas")[0].addEventListener('keydown', doKeyDown,true);

		window.addEventListener('keydown', doKeyDown, true);
		function doKeyDown(e) {

			console.log("k");
			clearInterval(setinterval);
			updateMap();
			setinterval = setInterval("updateMap()", period*1000);
		}


		// 鼠标点击后记录，更新cellMapGuess
		$("#myCanvas").click(
			function(event){
				// 观赏模式点击方格无反应
				if(gameMode == 4)
					return;
				// 非游戏进行时点击方格无反应
				if(gameOn != 1)
					return;
				// 在方格外点击无反应
				if(event.offsetX > 625 || event.offsetX < 25 || event.offsetY > 625 || event.offsetY < 25)
					return;
				// 获取所点击方格对应数组下标，左上为零以此计数
				i = ((event.offsetX - 25) - ((event.offsetX - 25)%unit))/unit;
				j = ((event.offsetY - 25) - ((event.offsetY - 25)%unit))/unit;
				
				// alert("i,j"+i+","+j); 测试正确

				var canvas = document.getElementById('myCanvas');
				if (canvas.getContext) {
					var ctx = canvas.getContext('2d');

					//根据cellMap与cellMapGuess决定四种更新样式
					if(cellMap[i][j] == 1 && cellMapGuess[i][j] == 0){
						ctx.fillStyle = "rgba(125,125,255,1)";
						cellMapGuess[i][j] = 1;
					}
					else if(cellMap[i][j] == 0 && cellMapGuess[i][j] == 0){
						ctx.fillStyle = "rgba(125,125,125,0.8)";
						cellMapGuess[i][j] = 1;
					}
					else if(cellMap[i][j] == 1 && cellMapGuess[i][j] == 1){
						ctx.fillStyle = "rgba(125,125,255,0.7)";
						cellMapGuess[i][j] = 0;
					}
					else if(cellMap[i][j] == 0 && cellMapGuess[i][j] == 1){
						ctx.fillStyle = "rgba(125,125,125,0.5)";
						cellMapGuess[i][j] = 0;
					}
					else{
						alert(i+','+j+"[bug] map有误！cellMap[i][j]="+cellMap[i][j]+"  cellMapGuess[i][j]="+cellMapGuess[i][j]);
					}

					//清空
					ctx.clearRect(i*unit+25,j*unit+25,unit,unit); 
					//绘画方格，留边界，显示边框
					ctx.fillRect(i*unit+0.01*unit+25,j*unit+0.01*unit+25,unit-0.02*unit,unit-0.02*unit); 
				}
			}
		); 


		