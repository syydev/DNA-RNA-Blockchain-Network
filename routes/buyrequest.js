module.exports = function (app) {

	var express = require('express');
	var router = express.Router();
	var mysqlDB = require('../config/db');

    var readDB = function(query){
		return new Promise(function(resolve, reject){
			mysqlDB.query(query,  function(err, rows, fields ){
				var pd_id= rows.length+1;
				resolve(pd_id);
			});
		})
    }
    
	router.get('/', async function (req, res) {
		console.log(req.query.pid);
        var query = 'SELECT * FROM newbabodb.Product WHERE Product_id = '+ req.query.pid+';';
        var query2 = 'insert into newbabodb.Order value(?,?,?,?)'
        var order_id = await readDB('SELECT * FROM newbabodb.Order;');
        var buyer_id = req.session.userID;
        console.log(buyer_id);
		mysqlDB.query(query, function(err, rows, fields ){
			if(err){
				console.log('query error :'+err);
			}
			res.render('product', {
				login: req.session.login,
				userid: req.session.userID,
				username: req.session.username,
				authority: req.session.authority,
				page: 'product',
				items: rows,
				availability: 'yes',
            });
        })
        mysqlDB.query(query2,[order_id, req.session.userID, req.query.pid, 0],function(err,rows,fields){
            if(err){
				console.log('query error :'+err);
			}else{
                console.log(rows);
            }
          
        })
	});



	return router;
}