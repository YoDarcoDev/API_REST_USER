const {checkAndChange} = require('./assets/function.js');
const mysql = require('promise-mysql');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan')('dev');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');
const config = require('./assets/config');
// const { json } = require('body-parser');


// CONNEXION DATABASE
mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    port: config.db.port
}).then((db) => {
    console.log("Connecté");

    const app = express();
   


        // CREATION ROUTEUR
        let MembersRouter = express.Router();
        let Members = require('./assets/classes/members-class')(db, config)

        // MIDDLEWARE
        app.use(morgan);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(config.rootAPI+'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



        // ROUTES ('/api/v1/members/:id')
        MembersRouter.route('/:id')

            // Afficher un membre avec son id
            .get(async (req, res) => {
                let member = await Members.getByID(req.params.id)
                res.json(checkAndChange(member)) 
            })


            // Modifier un membre avec son ID
            .put(async(req, res) => {
               let updateMember = await Members.update(req.params.id, req.body.name)
               res.json(checkAndChange(updateMember))
            })    


            // Supprimer un membre avec son id
            .delete(async(req, res) => {
                let deleteMember = await Members.delete(req.params.id)
                res.json(checkAndChange(deleteMember))
            })


        // ROUTES ('/api/v1/members')
        MembersRouter.route('/')

            // Afficher tous les membres
            .get(async(req, res) => {
                let allMembers = await Members.getAll(req.query.max);
                res.json(checkAndChange(allMembers));
            })


            // Ajouter un membre avec son nom
            .post(async(req, res) => {
                let addMember = await Members.add(req.body.name);
                res.json(checkAndChange(addMember));
            })



        app.use(config.rootAPI+'members', MembersRouter);




        // PORT 8080
        app.listen(config.port, () => {
            console.log('Started on port '+config.port);
        })


}).catch((err) => {
    console.log("Error during Database Connection")
    console.log(err.message)
})


