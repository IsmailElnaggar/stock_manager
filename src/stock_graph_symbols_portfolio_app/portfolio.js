import React from 'react';
import _ from 'lodash';
import Stock from './stock';


class PortfolioHeader extends React.Component {
	render() {
		return (
			<div className='portfolio_header'>
				<span id='portfolio_name'>{this.props.name}</span>
				<button id='btn-usd' onClick={this.OnDollarClick.bind(this)}>$ Value</button>
				<button id='btn-usd' onClick={this.onEuroClick.bind(this)}>€ Value</button>
			</div>
		);
	}
	onEuroClick() {
		if (this.props.currency === 'EUR') {
			return;
		}
		const portfolioName = this.props.name;
		const fromCurrency = 'USD';
		const toCurrency = 'EUR';
		this.props.changeCurrency(portfolioName, fromCurrency, toCurrency);
	}
	OnDollarClick() {
		if (this.props.currency === 'USD') {
			return;
		}
		const portfolioName = this.props.name;
		const fromCurrency = 'EUR';
		const toCurrency = 'USD';
		this.props.changeCurrency(portfolioName, fromCurrency, toCurrency);
	}
}

class PortfolioFooter extends React.Component {
	render() {
		return (
			<div>
				<button onClick={this.onDisplayGraphClick.bind(this)} id='graph_click'>Graph</button>
				<button onClick={this.onDeletePortfolioClick.bind(this)} id='delete_portfolio'>Delete Portfolio</button>
			</div>
		);
	}
	onDeletePortfolioClick() {
		const portfolioName = this.props.name;
		this.props.deletePortfolio(portfolioName)
	}
	onDisplayGraphClick() {
		const portfolioName = this.props.name;
		document.getElementById('stock_graph').style.display = 'block';
		document.getElementById('app_body').style.opacity = 0.4;
		this.props.getStockCheckList(portfolioName);
	}
}

class StockTableHeader extends React.Component {
	renderCurrency() {
		if (this.props.currency === 'USD') {
			return (<span>$</span>);
		}
		return (<span>€</span>)
	}
	render() {
		return (
			<thead id='stock_table_header'>
			<tr>
				<th className='col-sm'>Name</th>
				<th className='col-sm'>Unit Value ({this.renderCurrency()})</th>
				<th className='col-sm'>Quantity</th>
				<th className='col-sm'>Total Value ({this.renderCurrency()})</th>
				<th className='col-sm'><button onClick={this.onAddStockClick.bind(this)}>Add Stock</button></th>
			</tr>
			</thead>
		);
	}
	onAddStockClick() {
		this.props.addStock(this.props.name);
	}
}

class StocksInPortfolio extends React.Component {
	renderStock() {
		return (_.map(this.props.stocks, (stock, index) => <Stock
			key={index}
			{...stock}
			name={this.props.name}
			saveStock={this.props.saveStock}
			removeStock={this.props.removeStock}
			saveStockSymbol={this.props.saveStockSymbol}
			saveUnitValue={this.props.saveUnitValue}
			saveQuantity={this.props.saveQuantity}
			saveSharesTotalValue={this.props.saveSharesTotalValue}
		/>));
	}
	render() {
		return (
			<table className='col-sm-12 table-bordered portfolio_stocks'>
				<StockTableHeader name={this.props.name} currency={this.props.currency} addStock={this.props.addStock}/>
				<tbody id='stock'>{this.renderStock()}</tbody>
			</table>
		);
	}
}

class PortfolioSum extends React.Component {
	renderPortfolioName() {
		return (<span>{this.props.name}</span>);
	}
	renderTotal() {
		return (<span>{this.props.totalValue}</span>);
	}
	renderCurrency() {
		if (this.props.currency === 'USD') {
			return (<span>$</span>)
		}
		return (<span>€</span>)
	}
	render() {
		return (
			<div className='portfolio_sum'>
				<p>Total value of {this.renderPortfolioName()} is: {this.renderTotal()} {this.renderCurrency()}</p>
			</div>
		);
	}
}

export default class Portfolio extends React.Component {

	render() {
		return (
			<div className='col-sm-6 portfolio'>
				<PortfolioHeader 
						name={this.props.name} 
						currency={this.props.currency}
						changeCurrency = {this.props.changeCurrency}
				/>
				<StocksInPortfolio
						name={this.props.name} 
						totalValue={this.props.totalValue}
						stocks={this.props.stocks}
						currency={this.props.currency}
						addStock={this.props.addStock}
						saveStock={this.props.saveStock}
						removeStock={this.props.removeStock}
						saveStockSymbol={this.props.saveStockSymbol}
						saveUnitValue={this.props.saveUnitValue}
						saveQuantity={this.props.saveQuantity}
						saveSharesTotalValue={this.props.saveSharesTotalValue}
				/>
				<PortfolioSum name={this.props.name} currency={this.props.currency} totalValue={this.props.totalValue}/>
				<PortfolioFooter 
						name={this.props.name} 
						stocks={this.props.stocks}
						monthlyTimeSeries={this.props.monthlyTimeSeries}
						currency={this.props.currency}
						deletePortfolio={this.props.deletePortfolio}
						getStockCheckList={this.props.getStockCheckList}
						getGraph={this.props.getGraph}
				/>
			</div>
		);
	}
}
