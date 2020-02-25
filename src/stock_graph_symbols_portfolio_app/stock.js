import React from 'react';
import ReactDataList from 'react-datalist';
import symbols from './symbols_list';

export default class Stocks extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			forcePoly: true,
			support: !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement)
		}
	}
	renderErrorSymbol() {
		if (this.props.errorName) {
			return (<p>{this.props.errorName}</p>);
		}
		return null;
	}
	renderErrorQuantity() {
		if (this.props.errorQuantity) {
			return (<p>{this.props.errorQuantity}</p>);
		}
		return null;
	}
	renderSymbols() {
		if (this.props.editable) {
			return (
				<td className='col-sm-2'>
					<ReactDataList id='react_datalist' defaultValue={this.props.stockName}
		                    list="symbols"
		                    options={symbols}
		                    forcePoly={this.state.forcePoly}
		                    onOptionSelected={this.onOptionSelected.bind(this)} 
		                 />
		                 {this.renderErrorSymbol()}
	            </td>
			);
		}
		return (<td className='col-sm'>{this.props.stockName}</td>);
	}
	renderQuantity() {
		if (this.props.editable) {
			return (
				<td className='col-sm'>
					<input 	id='quantity'
							defaultValue={this.props.quantity} 
							ref='inputQuantity'
							onInput={this.onInputQuantity.bind(this)}/>
					{this.renderErrorQuantity()}
				</td>
			);
		}
		return (<td className='col-sm'>{this.props.quantity}</td>)
	}
	renderButton() {
		if (this.props.editable) {
			return (
				<td className='col-sm'><button onClick={this.onStockSaveClick.bind(this)}>Save</button></td>
			);
		}
		return (
			<td className='col-sm'><button onClick={this.onStockRemoveClick.bind(this)}>Remove</button></td>
		);
	}
	render() {
		return (
			<tr>
				{this.renderSymbols()}
				<td className='col-sm'>{this.props.unitValue}</td>
				{this.renderQuantity()}
				<td className='col-sm'>{this.props.totalValue}</td>
				{this.renderButton()}
			</tr>
		);
	}
	onOptionSelected(option) {
		const portfolioName = this.props.name;
		const stockName = this.props.stockName;
		this.props.saveStockSymbol(portfolioName, stockName, option);
		this.props.saveUnitValue(portfolioName, option);
	}
	onInputQuantity() {
		const portfolioName = this.props.name;
		const stockName = this.props.stockName;
		const unitValue = this.props.unitValue;
		const quantity = Number.parseInt(this.refs.inputQuantity.value);
		if (!quantity) {
			return;
		}
		this.props.saveQuantity(portfolioName, stockName, quantity);
		this.props.saveSharesTotalValue(portfolioName, stockName, unitValue, quantity);
	}
	onStockSaveClick() {
		const portfolioName = this.props.name;
		const stockName = this.props.stockName;
		const quantity = this.props.quantity;
		this.props.saveStock(portfolioName, stockName, quantity);
	}
	onStockRemoveClick() {
		const portfolioName = this.props.name;
		const stockName = this.props.stockName;
		this.props.removeStock(portfolioName, stockName);
	}
}