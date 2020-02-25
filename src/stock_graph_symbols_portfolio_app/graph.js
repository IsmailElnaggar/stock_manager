import React from 'react';
import {LineChart} from 'react-easy-chart';
import _ from 'lodash';

class GraphHeader extends React.Component {
	render() {
		return (
			<div id='graph_head'>

				<span id='graph_name'>{this.props.graph_name}</span>
				<button id='btn_exit' onClick={this.onGraphExitClick.bind(this)}>Exit</button>

			</div>
		);
	}
	onGraphExitClick() {
		document.getElementById('stock_graph').style.display = 'none';
		document.getElementById('app_body').style.opacity = 1;
		this.props.exitGraph();
	}
}

class GraphCheckBox extends React.Component {
	render() {
		return (
			<li className='checker'><input type="checkbox" id={this.props.name} onClick={this.ifChecked.bind(this)}/> {this.props.name}</li>
		);
	}
	ifChecked() {
		if (!this.props.name) {
			return;
		}
		if (this.props.ifChecked) {
			this.props.removeLineFromGraph(this.props.name);
			return;
		}
		this.props.getGraph(this.props.graph_name, this.props.name);
	}
}

class GraphDateRange extends React.Component {
	render() {
		return (
			<div className='select_time'>
				<span id='starting_date_range'>Start Date
					<input
						// {["2019",this.getCurrentTime().slice(-5)].join('')} test
						type="date" id="starting_date" defaultValue={["2019",this.get_CurrentTime().slice(-6)].join('')} ref='starting_date'
						onChange={this.get_StartingDate.bind(this)}/>
				</span>
				<span id='ending_date_range'>End Date
					<input
						type="date" id="ending_date" defaultValue={this.get_CurrentTime()} ref='ending_date'
						onChange={this.get_EndingDate.bind(this)}/>
				</span>
			</div>
		);
	}

	get_CurrentTime() {
		var dated = new Date();
		var days = dated.getDate();
		if (days < 10) {
			days = '0' + days;
		}
		var months = dated.getMonth() + 1;
		if (months < 10) {
			months = '0' + months;
		}
		var years = dated.getFullYear();
		var date = years + '-' + months + '-' + days;

		return (date);
	}

	get_StartingDate() {
		var starting_time = this.refs.starting_time.value;
		var ending_time = this.props.ending_time;
		this.props.changeStartingDate(starting_time);
		this.props.renderLineChart(starting_time, ending_time);

	}

	get_EndingDate() {
		var ending_time = this.refs.ending_time.toString();
		var starting_time = this.props.starting_time;
		this.props.changeEndingDate(ending_time);
		this.props.renderLineChart(starting_time, ending_time);
	}
}

export default class Graph extends React.Component {
	renderLineChart(date_start, date_end) {
		var t_start;
		var t_end;
		var ts_data = this.props.graph_monthlyTimeSeries;

		if (!t_start) {
			t_start = this.props.starting_time;
		} else {
			t_start = date_start;
		}
		if (!t_end) {
			t_end = this.props.ending_time; // check later!
		} else {
			t_end = date_end;
		}
		var xy_data = [];
		for (var i in ts_data) {
			var s_data = [];
			if (!ts_data[i]) {
				return;
			}
			for (var j in ts_data[i]['monthlyTimeSeries']) {
				var new_j = j.replace(/-/gi, '');

				t_start = t_start.replace(/-/gi, '');
// t_end wrong? check later
				t_end = t_end.replace( /-/gi, '');
				if (new_j >= t_start) {
					s_data.push({
						x: [j.slice(5,7), j.slice(0,4)].join("-"),
						y: Number.parseFloat(ts_data[i]['monthlyTimeSeries'][j]['4. close'])
					});
				} //2019-02-23 (5,7)(0,4)
			}
			xy_data.push(s_data.reverse());
			//xy_data.reverse();
		}
// reference https://experience-experiments.github.io/react-easy-chart/line-chart/index.html#introduction
		return (
			<LineChart
				style={{ '.label': { fill: 'black' } }}
				//xTicks={12}
				axes
				xType={'text'}
				//datePattern={'%d-%m-%y'}
				//tickTimeDisplayFormat={'%x-'}
				axisLabels={{x: 'Date by Month-Year', y: 'Value of Stock'}}
				margin={{top: 10, right: 10, bottom: 50, left: 50}}

				grid
				verticalGrid
				interpolate={'linear'}
				width={850}
				height={425}
				data={xy_data}
			/>
		);
	}

	renderStockCheckList() {
		return (_.map(this.props.graph_stockList, (stock, index) => <GraphCheckBox
																	key={index} 
																	{...stock}
																	getGraph={this.props.getGraph}
																	removeLineFromGraph={this.props.removeLineFromGraph}
																	graph_name={this.props.graph_name}/>));
	}

	render() {
		return (
			<div>
				<GraphHeader
					graph_name={this.props.graph_name}
					exitGraph={this.props.exitGraph}
				/>				
				<div className='stockList'>{this.renderStockCheckList()}</div>
				<div className='line_chart'>{this.renderLineChart()}</div>
				<GraphDateRange
					renderLineChart={this.renderLineChart.bind(this)}
					starting_time={this.props.starting_time}
					ending_time={this.props.ending_time}
					changeStartingDate={this.props.changeStartingDate}
					changeEndingDate={this.props.changeEndingDate}
				/>
			</div>
		);
	}
}