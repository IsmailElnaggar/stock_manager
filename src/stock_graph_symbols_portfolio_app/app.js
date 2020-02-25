import React from 'react';
import Portfolio from './portfolio';
import Graph from './graph';
import _ from 'lodash';


// create portfolio input and portfolio count
class CreatePortfolio extends React.Component {
	renderError() {
		if (this.props.error) {
			return (<span>{this.props.error}</span>);
		}
	}
	render() {
		return (
			<div className='create_portfolio'>
				<form onSubmit={this.onCreatePortfolioClick.bind(this)}>
					<input type="text" placeholder='Enter Portfolio Name' ref='inputName'/><span>  </span>
					<button onClick={this.onCreatePortfolioClick.bind(this)}>Create a Portfolio</button>
					{this.renderError()}

				</form>

				<p id='portfolio_number'>You have {this.props.portfolios.length} different portfolios.</p>
			</div>
		);
	}
	onCreatePortfolioClick(event) {
		event.preventDefault();
		const portfolioName = this.refs.inputName.value;
		this.props.createPortfolio(portfolioName);
		this.refs.inputName.value = '';
	}
}

// application combined
export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			portfolios: JSON.parse(localStorage.getItem('portfolios')) || [],
			graph_monthlyTimeSeries: [],
			graph_stockList: []
		}
	}

	//portfolios
	createPortfolio(portfolioName) {
		if (!portfolioName) {

			// check that a name for the portfolio has been set before being created
			this.setState({
				error: 'Please provide a name for the portfolio!',
				portfolios: this.state.portfolios
			})
			return;
		}
		if (_.find(this.state.portfolios, portfolio => portfolio.name === portfolioName)) {
			// check if portfolio name is taken
			this.setState({
				error: 'That name already exists. Please choose another name!',
				portfolios: this.state.portfolios
			})
			return;
		}

		this.state.portfolios.push({
			name: portfolioName,
			stocks: [],
			errorUnsaved: null,
			totalValue: 0,
			currency: 'USD',
			exchangeRate: 0
		})

		this.setState({
			error: null,
			portfolios: this.state.portfolios
		})
		// set portfolio data to localStorage
		localStorage.setItem('portfolios', JSON.stringify(this.state.portfolios));
	}

	deletePortfolio(portfolioName) {
		_.remove(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		this.setState({
			portfolios: this.state.portfolios
		})
		// reset the portfolio data after removal
		localStorage.setItem('portfolios', JSON.stringify(this.state.portfolios));
	}

	changeCurrency(portfolioName, oldCurrency, newCurrency) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const url = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=" + oldCurrency + "&to_currency=" + newCurrency + "&apikey=9GKQFS9H8XHG6L26";
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", url, true);
		xmlHttpRequest.onreadystatechange = function() {
			if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {

				var jsonObj = JSON.parse(xmlHttpRequest.responseText);
				var exchangeRate = jsonObj['Realtime Currency Exchange Rate']['5. Exchange Rate'];
				portfolio.currency = newCurrency;
				portfolio.exchangeRate = exchangeRate;
				portfolio.stocks.map(stock => stock.unitValue = Number.parseFloat(stock.unitValue * exchangeRate).toFixed(2));
				portfolio.stocks.map(stock => stock.totalValue = Number.parseFloat(stock.totalValue * exchangeRate).toFixed(2));
				portfolio.totalValue = Number.parseFloat((portfolio.totalValue * exchangeRate).toFixed(2));
				this.setState({
					portfolios: this.state.portfolios
				})
			}
		}.bind(this)

		xmlHttpRequest.send();
	}

	//stocks

	addStock(portfolioName) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);

		// check that all stocks are saved before adding a new symbol
		if (_.find(portfolio.stocks, stock => stock.editable === true)) {
			portfolio.errorUnsaved = 'Please save your entry before adding another stock!';
			this.setState({
				portfolios: this.state.portfolios
			})
			return;
		}

		portfolio.stocks.unshift({
			stockName: '',
			unitValue: '',
			quantity: '',
			totalValue: '',
			editable: true,
			errorName: null,
			errorQuantity: null,
		})

		portfolio.errorUnsaved = null;
		portfolio.errorExtraStock = null;
		this.setState({
			portfolios: this.state.portfolios
		})
	}

	saveStock(portfolioName, stockSymbol, quantity) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const stock = _.find(portfolio.stocks, stock => stock.stockName === stockSymbol);

		if (!stockSymbol) {
			// a stock symbol must be selected before saving
			stock.errorName = 'Please select a stock from the list';
			this.setState({
				portfolios: this.state.portfolios
			})
			return;
		}
		if (!quantity) {

			// amount of shares must be entered before saving
			stock.errorQuantity = 'Please enter quantity';
			this.setState({
				portfolios: this.state.portfolios
			})
			return;
		}
		if (_.find(portfolio.stocks, stock => stock.editable === true)) {
			portfolio.errorUnsaved = null;
		}
		stock.editable = false;
		portfolio.totalValue = portfolio.totalValue + stock.totalValue;

		this.setState({
			portfolios: this.state.portfolios
		})

		// put the stocks data into localStorage
		localStorage.setItem('portfolios', JSON.stringify(this.state.portfolios));
	}

	removeStock(portfolioName, stockSymbol) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const stock = _.find(portfolio.stocks, stock => stock.stockName === stockSymbol);

		portfolio.totalValue = portfolio.totalValue - stock.totalValue;
		_.remove(portfolio.stocks, stock => stock.stockName === stockSymbol);

		this.setState({
			portfolios: this.state.portfolios
		})
		localStorage.setItem('portfolios', JSON.stringify(this.state.portfolios));
	}

	saveStockSymbol(portfolioName, stockSymbol, sameSymbol) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const stock = _.find(portfolio.stocks, stock => stock.stockName === stockSymbol);
		const sameStockSymbol = _.find(portfolio.stocks, stock => stock.stockName === sameSymbol);

		if (sameStockSymbol) {
			stock.errorName = 'This Stock already exists';

			this.setState({
				portfolios: this.state.portfolios
			})
			return;
		}
		stock.stockName = sameSymbol;
		stock.errorName = null;
		this.setState({
			portfolios: this.state.portfolios
		})
	}

	saveUnitValue(portfolioName, stockSymbol) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const stock = _.find(portfolio.stocks, stock => stock.stockName === stockSymbol);
		const url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + stockSymbol + "&apikey=9GKQFS9H8XHG6L26";
		var xmlHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open("GET", url, true);
		xmlHttpRequest.onreadystatechange = function() {
			if (xmlHttpRequest.readyState === 4 && xmlHttpRequest.status === 200) {
				var jsonObj = JSON.parse(xmlHttpRequest.responseText);
				var lastRefreshed = jsonObj['Meta Data']['3. Last Refreshed'].slice(0, 10);
				var unitValue = Number.parseFloat(jsonObj['Time Series (Daily)'][lastRefreshed]['4. close']);
				if (portfolio.currency === 'EUR') {
					stock.unitValue = Number.parseFloat((unitValue * portfolio.exchangeRate).toFixed(2));
				} else {
					stock.unitValue = unitValue;
				}
				this.setState({
					portfolios: this.state.portfolios
				})
			}
		}.bind(this)

		xmlHttpRequest.send();
	}

	saveQuantity(portfolioName, stockSymbol, quantity) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const stock = _.find(portfolio.stocks, stock => stock.stockName === stockSymbol);
		stock.quantity = quantity;
		stock.errorQuantity = null;
		this.setState({
			portfolios: this.state.portfolios
		})
	}

	saveSharesTotalValue(portfolioName, stockSymbol, unitValue, quantity) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const stock = _.find(portfolio.stocks, stock => stock.stockName === stockSymbol);
		stock.totalValue = Number.parseFloat((unitValue * quantity).toFixed(2));
		this.setState({
			portfolios: this.state.portfolios
		})
	}

	// graph

	// display stocks as a checkbox list
	getStockCheckList(portfolioName) {
		const portfolio = _.find(this.state.portfolios, portfolio => portfolio.name === portfolioName);
		const stockNames = _.map(portfolio.stocks, stock => stock.stockName);
		stockNames.sort()
		var graph_stockList = [];
		for (var i = 0; i < stockNames.length; i++) {
			graph_stockList.push({
				name: stockNames[i],
				ifChecked: false
			})
		}
		//.sort();
		this.setState({
			graph_stockList: graph_stockList,
			graph_name: portfolio.name,
		})
		this.get_CurrentDate();
	}

	// use this to set the start date of the graph automatically as one year from current date
	grab_CDateMinusYear() {
		var datenow = new Date();
		var daynow = datenow.getDate();
		if (daynow < 10) {
			daynow = '0' + daynow;
		}
		var monthnow = datenow.getMonth() + 1;
		if (monthnow < 10) {
			monthnow = '0' + monthnow;
		}
		var yearnow = datenow.getFullYear();
		var date = yearnow + '-' + monthnow + '-' + daynow;

		return (date);
	}


	//set the current date as the default end date and the start date as the end date: day,month,"2019"
	get_CurrentDate() {
		var mydate = new Date();
		var d = mydate.getDate();
		if (d < 10) {
			d = '0' + d;
		}
		var m = mydate.getMonth() + 1;
		if (m < 10) {
			m = '0' + m;
		}
		var y = mydate.getFullYear();
		var date = y + '-' + m + '-' + d;

		this.setState({
			//starting_time: ["2019",this.grab_CDateMinusYear().slice(-6)].join(''),
			starting_time: ["2019",date.slice(-6)].join(''),
			//ending_time:
			ending_time: date
		})
	}
	// get the checked stocks and monthlyTimeSeries to be displayed on the graph
	getGraph(portfolioName, stockSymbol) {

		const url = "https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=" + stockSymbol + "&apikey=9GKQFS9H8XHG6L26"
		var xmlHttpRequestent = new XMLHttpRequest();
		xmlHttpRequestent.open("GET", url, true);
		xmlHttpRequestent.onreadystatechange = function() {
			if (xmlHttpRequestent.readyState === 4 && xmlHttpRequestent.status === 200) {
				var jsonObj = JSON.parse(xmlHttpRequestent.responseText);

				var monthlyTimeSeries = jsonObj['Monthly Time Series'];
				this.state.graph_monthlyTimeSeries.push({
					monthlyTimeSeries: monthlyTimeSeries,
					name: stockSymbol,
					ifChecked: true
				});
				const selectedSymbol = _.find(this.state.graph_stockList, stock => stock.name === stockSymbol);
				selectedSymbol.ifChecked = true;

				this.setState({
					graph_monthlyTimeSeries: this.state.graph_monthlyTimeSeries,
					graph_stockList: this.state.graph_stockList
				})
			}
		}.bind(this)
		xmlHttpRequestent.send();
	}

	// remove the time series data from unchecked symbols from the graph
	removeLineFromGraph(stockSymbol) {
		const selectedStock = _.find(this.state.graph_stockList, stock => stock.name === stockSymbol);
		selectedStock.ifChecked = false;
		_.remove(this.state.graph_monthlyTimeSeries, monthlyTimeSeries => monthlyTimeSeries.name === stockSymbol);
		this.setState({
			graph_monthlyTimeSeries: this.state.graph_monthlyTimeSeries,
			graph_stockList: this.state.graph_stockList
		})
	}

	//change the start date of the graph
	changeStartingDate(starting_time) {
		this.setState({
			starting_time: starting_time
		})
	}
	//change the end date of the graph
	changeEndingDate(ending_time) {
		this.setState({
			ending_time: ending_time
		})
	}
	// exit the graph and close
	exitGraph() {
		this.setState({
			graph_monthlyTimeSeries: [],
			graph_stockList: [],
			graph_name: '',
		})
	}

	// graph render
	render() {
		return (
			<div>
				<div className='container' id='app_body'>
					<CreatePortfolio
						error={this.state.error}
						portfolios={this.state.portfolios}
						createPortfolio={this.createPortfolio.bind(this)}
					/>
					<div className='row portfolios'>
						{this.renderPortfolio()}
					</div>

				</div>
				<div id = 'stock_graph' >
					<Graph
						graph_monthlyTimeSeries={this.state.graph_monthlyTimeSeries}
						graph_stockList={this.state.graph_stockList}
						graph_name={this.state.graph_name}
						getGraph={this.getGraph.bind(this)}
						removeLineFromGraph={this.removeLineFromGraph.bind(this)}
						starting_time={this.state.starting_time}
						ending_time={this.state.ending_time}
						changeStartingDate={this.changeStartingDate.bind(this)}
						changeEndingDate={this.changeEndingDate.bind(this)}
						exitGraph={this.exitGraph.bind(this)}

					/>
				</div>
			</div>
		);
	}

	renderPortfolio() {
		return (_.map(this.state.portfolios, (portfolio, index) => <Portfolio
			key={index}
			{...portfolio}
			deletePortfolio={this.deletePortfolio.bind(this)}
			addStock={this.addStock.bind(this)}
			saveStock={this.saveStock.bind(this)}
			removeStock={this.removeStock.bind(this)}
			saveStockSymbol={this.saveStockSymbol.bind(this)}
			saveUnitValue={this.saveUnitValue.bind(this)}
			saveQuantity={this.saveQuantity.bind(this)}
			saveSharesTotalValue={this.saveSharesTotalValue.bind(this)}
			changeCurrency={this.changeCurrency.bind(this)}
			getStockCheckList={this.getStockCheckList.bind(this)}
			getGraph={this.getGraph.bind(this)}
		/>));
	}
}