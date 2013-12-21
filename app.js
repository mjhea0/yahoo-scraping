// dependencies
var async=require("async");
var fs = require('fs');
var request=require("request");
var cheerio=require("cheerio");
var writeStream = fs.createWriteStream("file.csv");

// development starts here
writeStream.write('Firm,' + 'Action,'+'Company,'+'Ranking,'+'Price Ranking,'+'Closing Price' + '\n');

var getStockPrice= function(stock,doneCallBack){
	request("http://finance.yahoo.com/q?s="+stock+"&ql=1",function(err,response,body) {
		if (!err && response.statusCode == 200) {
			// console.log(body) 
			$ = cheerio.load(body);
			var stockPrice=$(".yfnc_tabledata1").first().text();
			return doneCallBack(null,stockPrice);
		}
	});
};

request("http://www.analystratings.net/ratings/USA/12-18-2013/", function(err,response,body) {
  if (!err && response.statusCode == 200) {
	  // console.log(body) 
	  $ = cheerio.load(body);
	  $("#ratingstable tbody tr").each(function(i,el){
	    var getByIndex=$(this).children();
	    var firm=getByIndex.eq(0).text();
	    var action=getByIndex.eq(1).text();
	    var company=getByIndex.eq(2).text();
	    var ranking=getByIndex.eq(3).text();
	    var priceRanking=getByIndex.eq(4).text();
	    // getting the stock Symbol
	    var stockSymbol=getByIndex.eq(2).children().text();
      // async takes an array
	    var stockArr=[];
	    stockArr.push(stockSymbol);
      // Used Async module 
      async.map(stockArr,getStockPrice,function(err,stockPrice){
     		writeStream.write(firm+ ',' + action +','+company+','+ranking+','+priceRanking+','+stockPrice.toString()+'\n');
      });  
      console.log("\nDONE!\n")     
    });
	}
});


