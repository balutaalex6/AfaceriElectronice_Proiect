'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const sequelize = new Sequelize('showroomDB', 'root', '')

let app = express()
app.get('/', function(req, res){
    res.sendFile('welcome.html', { root: __dirname + "/app/views" } );
})
app.get('/go', function(req, res){
    res.sendFile('index.html', { root: __dirname + "/app" } );
})
app.use(express.static(__dirname + '/app'))
app.use(bodyParser.json())

app.locals.companies = []

let Company = sequelize.define('company', {
	name: {
		allowNull: false,
		type: Sequelize.STRING
	},
	email: {
		allowNull: false,
		type: Sequelize.STRING,
		validate: {
			isEmail: true
		}
	},
	stock_label: {
			allowNull: false,
			type:Sequelize.STRING
		}
})

let Model = sequelize.define('model', {
	title: {
		allowNull: false,
		type: Sequelize.STRING
	},
	body_type: {
		allowNull: false,
		type: Sequelize.TEXT,
		validate: {
			len: [1, 1000]
		}
	},
	price: {
			allowNull: false,
			type: Sequelize.FLOAT
		}
	
})

Company.hasMany(Model, {
	foreignKey: 'companyId'
})
Model.belongsTo(Company, {
	foreignKey: 'companyId'
})

app.get('/create', (req, res) => {
	sequelize
		.sync({
			force: true
		})
		.then(() => {
			res.status(201).send('created')
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.get('/companies', (req, res) => {
	Company
		.findAll({
			attributes: ['id', 'name', 'email','stock_label']
		})
		.then((companies) => {
			res.status(200).send(companies)
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.get('/companies/:id', (req, res) => {
	Company
		.find({
			attributes: ['id', 'name', 'email','stock_label'],
			where: {
				id: req.params.id
			}
		})
		.then((company) => {
			res.status(200).send(company)
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.post('/companies', (req, res) => {
	Company
		.create(req.body)
		.then(() => {
			res.status(201).send('created')
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.put('/companies/:id', (req, res) => {
	Company
		.find({
			where: {
				id: req.params.id
			}
		})
		.then((company) => {
			return company.updateAttributes(req.body)
		})
		.then(() => {
			res.status(201).send('modified')
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.delete('/companies/:id', (req, res) => {
	Company
		.find({
			where: {
				id: req.params.id
			}
		})
		.then((company) => {
			return company.destroy()
		})
		.then(() => {
			res.status(201).send('removed')
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.get('/companies/:id/models', (req, res) => {
	Company
		.find({
			where: {
				id: req.params.id
			},
			include: [Model]
		})
		.then((company) => {
			return company.getModels()
		})
		.then((models) => {
			res.status(200).send(models)
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.get('/companies/:id/models/:mId', (req, res) => {
	Model
		.find({
			attributes: ['id', 'title', 'body_type','price'],
			where: {
				id: req.params.mId
			}
		})
		.then((model) => {
			res.status(200).send(model)
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.post('/companies/:id/models', (req, res) => {
	Company
		.find({
			where: {
				id: req.params.id
			}
		})
		.then((company) => {
			let model = req.body
			model.companyId = company.id
			return Model.create(model)
		})
		.then(() => {
			res.status(201).send('created')
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.put('/companies/:id/models/:mId', (req, res) => {
	Model
		.find({
			where: {
				id: req.params.mId
			}
		})
		.then((model) => {
			model.title = req.body.title
			model.body_type = req.body.body_type
			model.price=req.body.price
			return model.save()
		})
		.then(() => {
			res.status(201).send('modified')
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})

})

app.delete('/companies/:id/models/:mId', (req, res) => {
	Model
		.find({
			where: {
				id: req.params.mId
			}
		})
		.then((model) => {
			return model.destroy()
		})
		.then(() => {
			res.status(201).send('removed')
		})
		.catch((error) => {
			console.warn(error)
			res.status(500).send('error')
		})
})

app.listen(8080)
