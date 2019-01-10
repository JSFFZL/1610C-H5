require.config({
	paths:{
		'mui': './libs/mui.min',
		'picker': './libs/mui.picker.min',
		'echarts':'./libs/echarts.min',
		'$dom':'./dom',
		'dtpicker':'./libs/mui.dtpicker'
	},
	shim: {
        "picker": { //picker在mui执行完成之后再执行
            deps: ['mui'],
        },
		 "dtpicker": { //picker在mui执行完成之后再执行
		    deps: ['mui'],
		},
    }
})