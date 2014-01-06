/**
 * Created by lunjiang on 14-1-6.
 */

module.exports=function(){
    this.host="localhost"
    this.database="webfront";
    this.tabName ='';
    this.userName = "";
    this.password = "";

    function connect(){

        var mysql      = require('mysql');
        var connection = mysql.createConnection({
            host     : 'localhost',
            database : 'webfront',
            user     : 'root',
            password : 'root'
        });

        connection.connect();
        connection.query
        connection.query('SELECT * from tpl_api', function(err, rows, fields) {
            if (err) throw err;
            console.log("fields:",fields)
            console.log('The solution is: ', rows);
        });

        connection.end();

    }
    connect();
    function close(){

    }

    function select(){

    }
    function update(){

    }
    function del(){

    }
}

