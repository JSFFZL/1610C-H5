require(['./config'], function() {
	require(['mui', 'picker', 'echarts', '$dom', 'dtpicker'], function(mui, picker, echarts, $dom, dtpicker) {
		// mui.init();
		function init() {
			//第一个demo，拖拽后显示操作图标，点击操作图标删除元素；
			document.querySelector('.mui-inner-wrap').addEventListener('drag', function(event) {
				event.stopPropagation();
			});
			

			//初始化scroll控件
			mui('.mui-scroll-wrapper').scroll({
				scrollY: true, //是否竖向滚动
				scrollX: true, //是否横向滚动
				startX: 0, //初始化时滚动至x
				startY: 0, //初始化时滚动至y
				indicators: false, //是否显示滚动条
				deceleration: 0.0002, //阻尼系数,系数越小滑动越灵敏
				bounce: true //是否启用回弹
			});

			//左滑删除
			list();

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

			//缓存当前用户
			localUser();
			
			// billAjax();

		}
		var picker = null,
			dtPicker = null,
			curYear = new Date().getFullYear(), //年
			curMonth = new Date().getMonth() + 1; //月份
			_selectStatus = $dom('.select-status'), //月/年
			_selectDate = $dom('.select-date'), //时间年/月
			status = 'month',//初始的值
			localStorageUid = localStorage.getItem('uid'); //

		//缓存用户
		function localUser() {
			mui.ajax('/users/api/getUser',{
				data:{
					nick_name:'lili'
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				success:function(data){
					var uid = data.msg[0]._id;
					console.log(uid)
					//存到localStorage
					localStorage.setItem('uid',uid);
					billAjax();
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
		}

		//初始化时间
		function loadTime() {
			picker = new mui.PopPicker(); //初始化popPicker多级选择器
			picker.setData([{
				value: 'month',
				text: '月'
			}, {
				value: 'year',
				text: '年'
			}]); //picker对象添加数据
			curMonth = curMonth < 10 ? '0' + curMonth : curMonth; //月份小于10，月份补个0
			//设置年月
			_selectDate.innerHTML = curYear + '-' + curMonth;
			//选择日期（组件）
			dtPicker = new mui.DtPicker({
				type: 'month'
			}); //默认是月
		}



		//选择时间
		function timerSelect() {
			// 点击月年
			_selectStatus.addEventListener('tap', function() {
				picker.show(function(selectItems) {
					status = selectItems[0].value; //状态值
					_selectStatus.innerHTML = selectItems[0].text; //

					//页面自定义元素
					var _monthH5 = document.querySelector("[data-id=title-m]"),
						_yearH5 = document.querySelector("[data-id=title-y]"),
						_mPicker = document.querySelector("[data-id=picker-m]"),
						_yPicker = document.querySelector("[data-id=picker-y]");

					//年月视图
					// var 

					if (status === 'month') { //月
						_selectDate.innerHTML = curYear + '-' + curMonth; //当前年-月

						_monthH5.style.display = 'inline-block';

						_mPicker.style.display = 'block';

						_yearH5.style.width = '50%';

						_yPicker.style.width = '50%';
					} else { //年
						_selectDate.innerHTML = curYear;

						_monthH5.style.display = 'none';

						_mPicker.style.display = 'none';

						_yearH5.style.width = '100%';

						_yPicker.style.width = '100%';
						
						
					}
				})
			})

			//点击日期
			_selectDate.addEventListener('tap', function() {
				dtPicker.show(function(selectItems) {
					//console.log(selectItems.y);//{text: "2016",value: 2016} 
					//console.log(selectItems.m);//{text: "05",value: "05"} 

					if (status === 'month') {
						_selectDate.innerHTML = selectItems.y.value + '-' + selectItems.m.value;
					} else {
						_selectDate.innerHTML = selectItems.y.value;
					}

				})
			})
		}

		//显示侧边栏
		function onclick() {
			document.querySelector(".mui-icon-list").addEventListener('tap', function() {
				mui('.mui-off-canvas-wrap').offCanvas('show');
			})
		}
		//区域滚动
		//tab切换
		function tab() {
			mui(".nav-tab").on('tap', 'li', function() {
				var _li = document.querySelectorAll(".nav-tab li");
				for (var i = 0; i < _li.length; i++) {
					_li[i].classList.remove("active");
				}
				this.classList.add("active");
				var tab = this.innerHTML;
				if (tab == "图表") {
					document.querySelector('.tab2').style.display = "block";
					document.querySelector('.tab1').style.display = "none";
				} else {
					document.querySelector('.tab2').style.display = "none";
					document.querySelector('.tab1').style.display = "block";
				}
			})
		}
		//左滑删除
		function list() {
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
		
		
		
		
		//按时间查询
		function billAjax(){
			var timeText = $dom('.select-date').innerHTML;
			
			mui.ajax('/bill/api/getBillTimer',{
				data:{
					uid:localStorageUid,
					timer:timeText
				},
				dataType:'json',//服务器返回json格式数据
				type:'post',//HTTP请求类型
				timeout:10000,//超时时间设置为10秒；
				success:function(data){
					
					
					
					var str = '';
					data.msg.forEach(function(arr){
						str+=`<li class="mui-table-view-cell">
									<div class="mui-slider-right mui-disabled">
										<a class="mui-btn mui-btn-red">删除</a>
									</div>
									<div class="mui-slider-handle bill-item">
										<dl>
											<dt>
												<span class="${arr.icon}"></span>
											</dt>
											<dd><p>住宿</p><p>${arr.timer}</p></dd>
										</dl>
										<span class="${arr.type == '支出' ? 'red' : 'green'}">${arr.money}</span>
									</div>
								</li>`
					})
					$dom('.mui-table-view').innerHTML = str;
				},
				error:function(xhr,type,errorThrown){
					
				}
			});
		}
		
		
		
		//执行开始方法
		init();

	})
})
