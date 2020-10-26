// Wiring up the User Interface

const path = require('path')
const express = require('express');
const hbs = require('hbs');
const { handlebars } = require('hbs');
const { WSASERVICE_NOT_FOUND } = require('constants');
const { worker } = require('cluster');
const { uptime } = require('process');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()



// Define paths for Express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
// configure partial path
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirectoryPath))


app.get('',(req, res)=>{
    res.render('index', {
        title: 'Weather App',
        name: 'Raghavendra Prabhu'
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {
        title: 'About Me',
        name: 'Raghavendra Prabhu'
    })
})


app.get('/help', (req, res)=>{
    res.render('help',{
        helpText: 'This is myhelpful text',
        title: 'Help',
        name: 'Raghavendra Prabhu'
    })
})


app.get('/weather', (req, res)=>{
    if (!req.query.address){
        return res.send({
            error: "You must provide a Address term"
        })
    }

    geocode(req.query.address, (error, {latitude,longitude, location} ={})=>{
        if (error){
          return res.send({error})
      
        }
        forecast( latitude, longitude, (error, forecastData) => {
          if (error){
            return res.send({error})
      
          }
          res.send({
              forecast: forecastData,
              location,
              address: req.query.address
          })
        })
      })


})

app.get('/products', (req, res)=>{
    /*
        At one go Html can receive or send.
        It cannot do the both
    */

    if (!req.query.search){
        return res.send({
            error: "You must provide a search term"
        })
    }
    res.send({
        products: []
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name:'Raghavendra',
        errorMessage: 'Help article not found'
    })
})

// Match anything that has not been matched before(wild card character)
// We need to put here as it is going find at end
app.get('*', (req, res)=>{
    res.render('404', {
        title: '404',
        name: 'Raghavendra',
       errorMessage: 'Page not found'
    })

})


app.listen(3000,()=>{
    console.log('Server is up on port 3000')
})