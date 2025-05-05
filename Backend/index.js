const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const path = require('path');


const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 3000;

const db = require('./models/');


app.use(
    cors(
        {
            origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
            optionsSuccessStatus: 200, // For legacy browser support
        }
    ), 
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

db.sequelize.sync({ 
    //force: true 
    })
    .then(() => {
        console.log('Database synchronized successfully.');
    }).catch((error) => {
        console.error('Error synchronizing the database:', error);
    }
);

require('./routes')(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});