require(['./config'],function(){
	require(['mui','picker','echarts','$dom','dtpicker'],function(mui,picker,echarts,$dom,dtpicker){
		// mui.init();
		function init(){
	
			
			//初始化时间
			// loadData();
			
			//选择时间
			// echart();
			onclick();
			
			//账单图表切换
			tab();
			
			//初始化时间
			loadTime();
			
			//选择时间
			timerSelect();
			
		}
		var picker = null,
			dtPicker = null,
			curYear = new Date().getFullYear(), //年
			curMonth = new Date().getMonth() + 1; //月份
			_selectStatus = $dom('.select-status'), //月/年
			_selectDate = $dom('.select-date'), //时间年/月
			status = 'month'; //初始的值
			

		//初始化时间
		function loadTime() {
			picker = new mui.PopPicker(); //初始化popPicker多级选择器
			picker.setData([{value: 'month',text: '月'}, {value: 'year',text: '年'}]);//picker对象添加数据
			curMonth = curMonth < 10 ? '0'+curMonth : curMonth; //月份小于10，月份补个0
			//设置年月
			_selectDate.innerHTML = curYear + '-' + curMonth; 
			//选择日期（组件）
			dtPicker = new mui.DtPicker({type:'month'}); //默认是月
		}
		
		
		
		//选择时间
		function timerSelect(){
			// 点击月年
			_selectStatus.addEventListener('tap',function(){
				picker.show(function (selectItems) {
					status = selectItems[0].value; //状态值
					_selectStatus.innerHTML = selectItems[0].text;//
					
					//页面之定义元素
					var _monthH5 = document.querySelector("[data-id=title-m]"), 
						_yearH5 = document.querySelector("[data-id=title-y]"),
						_mPicker = document.querySelector("[data-id=picker-m]"),
						_yPicker = document.querySelector("[data-id=picker-y]");
						
						if(status === 'month'){  //月
							_selectDate.innerHTML = curYear + '-' + curMonth; //
							
							_monthH5.style.display = 'inline-block';
							
							_mPicker.style.display = 'block';
							
							_yearH5.style.width = '50%';
							
							_yPicker.style.width = '50%';
						}else{  //年
							_selectDate.innerHTML = curYear;
							
							_monthH5.style.display = 'none';
							
							_mPicker.style.display = 'none';
							
							_yearH5.style.width = '100%';
							
							_yPicker.style.width = '100%';
							
						}
				})
			})
		
			//点击日期
			_selectDate.addEventListener('tap',function(){
				dtPicker.show(function (selectItems) { 
					//console.log(selectItems.y);//{text: "2016",value: 2016} 
					//console.log(selectItems.m);//{text: "05",value: "05"} 
					
					if(status === 'month'){
						_selectDate.innerHTML = selectItems.y.value + '-' + selectItems.m.value;
					}else{
						_selectDate.innerHTML = selectItems.y.value;
					}
					
				})
			})
		}
		
		//显示侧边栏
		function onclick(){
			document.querySelector(".mui-icon-list").addEventListener('tap',function(){
				mui('.mui-off-canvas-wrap').offCanvas('show');
			})
		}
		
		//tab切换
		function tab(){
			mui(".nav-tab").on('tap','li',function(){
				var _li = document.querySelectorAll(".nav-tab li");
				for(var i = 0; i < _li.length; i++){
					_li[i].classList.remove("active");
				}
				this.classList.add("active");
				var tab = this.innerHTML;
				if(tab == "图表"){
					document.querySelector('.tab2').style.display = "block";
					document.querySelector('.tab1').style.display = "none";
				}else{
					document.querySelector('.tab2').style.display = "none";
					document.querySelector('.tab1').style.display = "block";
				}
			})
		}
		//左滑删除
		function list(){
			var btnArray = ['确认', '取消'];
			mui('#OA_task_1').on('tap', '.mui-btn', function(event) {
				var elem = this;
				var li = elem.parentNode.parentNode;
				mui.confirm('确认删除该条记录？', '柠檬记账', btnArray, function(e) {
					if (e.index == 0) { //确定删除
						li.parentNode.removeChild(li);
					} else {
						setTimeout(function() {
							mui.swipeoutClose(li);
						}, 0);
					}
				});
			});
		}
		//执行开始方法
		init();
		
	})
})