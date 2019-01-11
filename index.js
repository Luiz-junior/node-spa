const restify = require('restify');
const bodyParser = require('body-parser');
const server = restify.createServer();
const errors = require('restify-errors');

server.use(bodyParser.json());

const knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'node_spa'
    }
});

server.get('/', restify.plugins.serveStatic({
    directory: './frontend',
    file: 'index.html'
}));

server.get('/read', (req, res) => {
    knex('rest')
        .then(data => res.send(data))
        .catch(err => console.error(err));
});

server.get('/show/:id', (req, res) => {
    let { id } = req.params
    knex('rest')
        .where('id', id)
        .first()
        .then(data => {
            if (!data) return res.send(new errors.BadRequestError('Nenhum dado foi encontrado!'));
            res.send(data);
        });
});

server.post('/create', (req, res) => {
    knex('rest')
        .insert(req.body)
        .then(data => {
            if (!data) return res.send(new errors.BadRequestError('Nenhum dado foi encontrado!'));
            res.json({ status: res.statusCode, id: data });
        });
});

server.put('/update/:id', (req, res) => {
    let { id } = req.params
    knex('rest')
        .where('id', id)
        .update(req.body)
        .then(data => {
            if (!data) return res.send(new errors.BadRequestError('Nenhum dado foi encontrado!'));
            res.json({ status: res.statusCode, message: 'Dados atualizados!' });
        });
});

server.del('/delete/:id', (req, res) => {
    let { id } = req.params
    knex('rest')
        .where('id', id)
        .delete()
        .then(data => {
            if (!data) return res.send(new errors.BadRequestError('Nenhum dado foi encontrado!'));
            res.json({ status: res.statusCode, message: 'Dados Excluídos!' });
        });
});

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});