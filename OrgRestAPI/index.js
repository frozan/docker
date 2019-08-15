/*eslint no-undef: "error"*/
/*eslint-env node*/

const express = require('express');
const Organization = require('./organization')
const bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.json());

app.get('/orgs/', (req, res) => {
    let organization = new Organization();
    organization.all(result => {
        res.json(result);
    });
});

//GET organization by Name
app.get('/orgs/:name/:page?', (req, res) => {
    let organization = new Organization();
    let page = (Number.parseInt(req.params.page));
    if(!Number.isInteger(page)){
        page = 0;
    }
    organization.search(req.params.name, page, result => {
        if(!result) {
            res.status(404).send();
        }
        else {
            res.json(result);
        }
    });
});

//Insert an organization
app.post('/orgs', (req, res) => {
    let org = req.body;
    let organization = new Organization();
    organization.create(org);
    res.json();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port+'...'));  