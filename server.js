var express = require('express'),
  app = express(),
  http = require('http'),
  bodyParser = require('body-parser'),
  httpServer = http.Server(app);

var multichain = require("multichain-node")({
    port: 6268,
    host: 'localhost',
    user: "multichainrpc",
    pass: "BMeUFamf4fu4dnDL7msryBaVzDXqNuu16iQEuj1grrpm"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/balance', function(req,res){
	var k = 0;
	multichain.getTotalBalances( function (err, balance) {
      	if (err) {
           console.log(err);
           //res.status(400);
	         res.send(err);
       } else  {
          var bal = 0;
          if (balance.length > 0){
            bal = balance[0]['qty'];

          } 
           console.log('Hello Money! New balance: ' + bal);

	         res.header('Content-type', 'text/html');
 	          var html = 'The new balance is ' + bal + '';
           res.end(html);    
              
	}
   });
});

/*
route for send asset function
 */
app.post('/send',function(req,res){
	var qty = req.body.qty;
  var someAsset = req.body.asset;
	var someAddress = req.body.address;

	multichain.sendAssetToAddress({address:someAddress, asset: someAsset, qty:parseInt(qty)},(err,data) =>{
    if(err){
        res.status(400).send(err);
        // console.log(err);
        // res.send(err)
    } else{
      console.log(data);
      res.send(data)
    }

    
  });
});

app.get('/addresses',function(req,res){
  multichain.getAddresses((err,data) =>{
    if(err){
        console.log(err);
        res.status(400);
        res.send(err);
    } else{
      console.log(data);
      res.header('Content-type', 'text/html');
      // var html = '<h4>' + data[0]+ '</h4>';
      return res.end(data + "");
    }

    
  });
});


app.listen(3000);
