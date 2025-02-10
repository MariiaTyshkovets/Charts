# Charts Application  

## Project Description  
This project visualizes market data in the form of charts (bar chart). The data is from **Fintacharts** API. The project features automatic authentication and token refresh, as well as the ability to subscribe to the selected instrument.  

## Functionality  
- Fetching market data  
- Visualization with a **bar chart** (although a candlestick chart might have been more suitable)  
- Automatic authentication and token refresh  
- Changed data updates after subscription  
- API requests configured to work through **Postman** (locally requires a Chrome extension due to CORS issues)  

## Technologies  
- **Angular 18** (Standalone Components)  
- **Chart.js** for charting  
- **RxJS** for stream handling  
- **SCSS** for styling  
- **Fintacharts API**  

## Installation and Setup  
1. Clone the repository  
   ```sh
   git clone [<repo_url>](https://github.com/MariiaTyshkovets/charts)
   cd charts
2. Install dependencies
   ```sh
   npm install
3. Run the application
   ```sh
   ng serve

## Important Notes
For the API to work correctly, you'll need to use the [Chrome extension](https://chromewebstore.google.com/detail/moesif-origincors-changer/digfbfaphojjndkpccljibejjbppifbc) to bypass CORS
Data will update only after subscribing to an instrument
The bar chart is used for the data visualization, but a candlestick chart might be more appropriate according to the context of the task

## Links
Demo: [Charts](https://mariiatyshkovets.github.io/charts/)
