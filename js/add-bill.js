require(['../js/config'], function() {
	require(['mui', '$dom'], function(mui, $dom) {


		function init() {
			mui.init();

			//初始化时间
			initDate();

			//添加点击事件
			addEvent();

			//选中-当前收支类型
			addClick();

			//收支类型高亮切换
			typeClass()
		}

		var dtpicker = null,
			curYear = new Date().getFullYear(),
			curMonth = new Date().getMonth() + 1,
			curDay = new Date().getDate(),
			_chooseTime = $dom('.choose-time'),
			http = 1; //防止频繁发送htt请求接口


		//点击完成向后台添加账单信息
		$dom('#btn-ok').addEventListener('tap', function() {
			addBil(); //调用添加账单信息接口
		})


		function initDate() {
			curMonth = curMonth < 10 ? '0' + curMonth : curMonth;
			curDay = curDay < 10 ? '0' + curDay : curDay;
			_chooseTime.innerHTML = curYear + '-' + curMonth + '-' + curDay;
		}

		//金额输入框键盘
		function addEvent() {
			var money = $dom('.money'); //显示金额
			mui('.keyword').on('tap', 'span', function() {
				var text = this.innerHTML;
				if (text == 'X') {
					if (money.innerHTML == '0.00') {
						money.innerHTML = '0.00'
					} else {
						money.innerHTML = money.innerHTML.substr(0, money.innerHTML.length - 1) //清除金额
						if (money.innerHTML.length == 0) {
							money.innerHTML = '0.00'
						}
					}
				} else if (money.innerHTML == '0.00') {
					money.innerHTML = text;
				} else if (money.innerHTML.indexOf('.') != -1 && text == '.') { //当前有.时，再次输入.
					money.innerHTML = money.innerHTML; //不能再次输入. 赋值当前输入框内容
				} else if (money.innerHTML.indexOf('.') != -1 && money.innerHTML.split('.')[1].length == 2) { //输入小数点后俩位
					money.innerHTML = money.innerHTML;
				} else {
					money.innerHTML += text; //拼接金额
				}
			})
		}

		//选中-当前收支类型
		function addClick() {
			var dl = document.querySelectorAll('.mui-slider-item dl');
			mui('.mui-slider-item').on('tap', 'dl', function() {
				for (var i = 0; i < dl.length; i++) {
					dl[i].classList.remove('active');
				}
				this.classList.add('active');
			})
		}

		function addBil() {
			/*
			author：mengqingfan@bawei.com
			timer:2019-01-11
			接口：/bill/api/addBill
			参数：uid（用户ID）type（收支类型）/money（金额）/timer（时间）/intro（说明）icon（图标）
			返回：成功/失败
			*/
			var type = $dom('.tab-list > .active').innerHTML; //类型
			var money = $dom('.money').innerHTML; //金额
			var timer = $dom('.choose-time').innerHTML;
			var intro = $dom('.mui-slider-item .active dd').innerHTML;
			var icon = $dom('.mui-slider-item .active dt span').className;
			console.log(type + money + timer + intro + icon)
			mui.ajax('/bill/api/addBill', {
				data: {
					uid: '5c343a24c5c14c4390fed318',
					type: type,
					money: money,
					timer: timer,
					intro: intro,
					icon: icon
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				success: function(res) {
					mui.alert(res.msg);
				}
			});
		}
		//收支类型的高亮显示
		function typeClass() {
			var tabList = document.querySelectorAll('.tab-list > .tab-item');

			mui('.tab-list').on('tap', '.tab-item', function() {
				
				if(http == 1){
					for (var i = 0; i < tabList.length; i++) {
						tabList[i].classList.remove('active');
					}
					this.classList.add('active');
					
					var cType = this.innerHTML; //当前点击内容
					cTypeFun(cType); //获取类型
				}else{
					mui.alert('客观您的手速太快了！')
				}
				
				
			})
		}

		//获取类别的接口
		function cTypeFun(cType) {
			http = 0;
			mui.ajax('/classIfy/api/classIfy', {
				data: {
					uid: '5c343a24c5c14c4390fed318',
					c_type: cType
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 5000, //超时时间设置为10秒；
				success: function(data) {
					var str = '';
					data.msg.forEach(function(arr) {
						str +=
							`
						<dl>
							<dt>
								<span class="${arr.c_icon}"></span>
							</dt>
							<dd>${arr.c_name}</dd>
						</dl>`
					})
					document.querySelector('.type-icon').innerHTML = str;
					http = 1;
				},
				error: function(xhr, type, errorThrown) {
					console.log(xhr);
					console.log(type);
					console.log(errorThrown);
				}
			});
		}



		//执行
		init();
	})
})