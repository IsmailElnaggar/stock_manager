School project for my master's degree program. Course was taken at Åbo Akademi University. First time using React for app development.

Testing useing Google Chrome.

Link to deployed webpage : https://it-teaching-abo-akademi.github.io/csdewas-project-2-IsmailElnaggar/

API used to fetch stock info: https://www.alphavantage.co/documentation

Graph made with react easy chart.
reference link:  https://experience-experiments.github.io/react-easy-chart/line-chart/index.html#introduction



Project Functional Requirements :

1. Create portfolio 10pt

a. The user can create an empty portfolio  
b. User should be able to enter the portfolio name 

c. A user should be able to create a decent number (min. 5-10) of portfolios

2. Add stock to portfolio 10p 

a. User must be able to add a stock to the portfolio by entering: i. the symbol of the stock and the number of shares he/she owns
b. There is no limit on the number of stocks a portfolio can contain 

3. View portfolio 10pt 

a. The user must be able to view the purchase value of the stock. The purchase value of the stocks should be fetched from a stock market exchange API.
b. The user must be able to change the currency between US dollar and Euro when displaying a portfolio (and its stocks). For simplicity, the USD/Euro exchange rate can be hardcoded (not fetched from an API). 
c. The user must be able to view the total value of the portfolio and its stocks updated with the latest values in the currently selected currency.

4. Compare stock value performances in a portfolio 10pt 

a. User must be able to see a graph showing the historic valuation of the stocks 
b. User must be able to adjust the time window of the graph by selecting the starting and ending date of the graph. 

5. Remove stock 5pt – A user can remove individual stocks from a portfolio 

6. Remove a portfolio 5pt 

a. The user can delete a portfolio 
b. When deleting a portfolio all associated stocks should be removed

7. The portfolios should be persistent over browser sessions 5pt 

a. You need to use the persistent local storage to save all data (portfolios, stocks, number of shares, initial values, latest values, and latest historical values) related to the created portfolios. That is, after closing and opening the browser the portfolio information should still be available regardless of having internet connection 

Non-functional requirements: 1. The layout should be responsive 5pt o You are free to decide on the layout and look of your application. The usability of your application will be considered when evaluating your solution. 

Constraints: - The project should be implemented using ReactJS. 


