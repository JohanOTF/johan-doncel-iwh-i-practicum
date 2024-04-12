const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.get('/', async (req, res) => {
    const contactsEndpoint = `https://api.hubapi.com/crm/v3/objects/contacts`;
    const headers = {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(contactsEndpoint, { headers });
        const data = resp.data.results;
        res.render('homepage', { data });      
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "firstname": req.body.frist_name,
            "lastname": req.body.last_name,
            "email": req.body.email,
        }
    }

    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts`;
    const headers = {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
        res.status(500).send('Error creating record');
    }
});

// Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});