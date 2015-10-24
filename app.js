var http = require('http');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pos-unoesc');

var db = mongoose.connection;

db.on('error', function(err){
    console.log('Erro de conexao', err);
});

db.on('open', function(){
    console.log('Conexão aberta');
});

db.on('connected', function(err){
    console.log('Conectado');
});

db.on('disconnected', function(err){
    console.log('Desconectado');
});

var Schema = mongoose.Schema;

var json_schema = {
    name: {type: String, default: ''},
    description: {type: String, default: ''},
    alcohol: {type: Number, min: 0},
    category: {type: String, default: ''},
    created_at: {type: Date, default: Date.now}
}

var BeerSchema = new Schema(json_schema);

var Beer = mongoose.model('Beer', BeerSchema);

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

        var model = new Beer(dados);
        
        var msg = '';

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
        var query = {}, msg = '';
        res.writeHead(200, {'Content-Type': 'application/json'});
        
        Beer.find(query, function(err, data){
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
        
        var Beer = mongoose.model('Beer', BeerSchema), query = {name: /skol/i};


        var mod = {
            name: 'Brahma', 
            alcohol: 4, 
            price: 6, 
            category: 'pilsen'};
            
        var optional = {
            upsert: false,
            multi: false
        }, msg = '';

        Beer.update(query, mod, function(err, data) {
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
        var Beer = mongoose.model('Beer', BeerSchema), query = {name: /skol/i}, msg = '';

        Beer.remove(query, function(err, data) {
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



