var http = require('http');
var Model = require('./model');

var msg = '';

var Controller = {
    create: function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/json'});
    
        var dados = {
            name: 'Skol',
            description: 'Mijo de Rato',
            alcohol: 4.5,
            price: 3.8,
            category: 'pilsen'
        }

        var model = new Model(dados);


        model.save(function(err, data){
            if(err){
                console.log('Erro: ', err);
                msg = 'Erro: ' + err;
            }
            else {
                console.log('Cerveja inserida: ', data);
                msg = 'Cerveja inserida: ' + data;
            }
            res.end(msg);
        });
    },
    retrieve: function(req, res) {
        var query = {};
        res.writeHead(200, {'Content-Type': 'application/json'});
        
        Model.find(query, function(err, data){
            if(err){
                console.log('Erro: ', err);
                msg = 'Erro: ' + err;
            }
            else{
                console.log('Listagem: ', data);
                msg = 'Listagem: ' + data;
            }
            
            res.end(msg);
        });
    },
    
    update: function(req, res) {

        res.writeHead(200, {'Content-Type': 'application/json'});
        
        var query = {name: /skol/i};


        var mod = {
            name: 'Brahma', 
            alcohol: 4, 
            price: 6, 
            category: 'pilsen'};
            
        var optional = {
            upsert: false,
            multi: false
        };

        Model.update(query, mod, function(err, data) {
            if(err) {
                console.log('Erro: ', err);
                msg = 'Erro: ' + err;
            }
            else {
                console.log('Cervejas atualizadas com sucesso: ', data);
                msg = 'Cervejas atualizadas com sucesso: ' + data;
            }
            
            res.end(msg);
        });
        
        
    },
    
    
    delete: function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        var query = {name: /skol/i};

        Model.remove(query, function(err, data) {
            if(err){
                console.log('Erro: ', erro);
                msg = 'Erro: ' + erro;
            }
            else {
                console.log('Cerveja deletada com sucesso, quantidade: ', data.result);
                msg = 'Cerveja deletada com sucesso, quantidade: '+ data.result;
            }
            
            res.end(msg);
        });        
        
    }
};


http.createServer(function (req, res) {

    console.log("URL: ", req.url);
    
    var url = req.url;
    
    switch(url) {
        case '/api/beers/create':
            Controller.create(req, res);
        break;
        
        case '/api/beers/retrieve': 
            Controller.retrieve(req, res);
        break;
        
        case '/api/beers/update':
            Controller.update(req, res);
        break;
        
        case '/api/beers/delete':
            Controller.delete(req, res);
        break;
        
        default:
            res.end('URL nao encontrada');
        break;
    }
  
}).listen(3000,  "127.0.0.1");

console.log('Server running at http://localhost:3000/');



