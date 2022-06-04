const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(
    {
        path: './config.env',
    }
)

let DB = '';

if ( process.env.NODE_ENV === 'development' ) {
    DB = process.env.DevMongoDB;
} else {
    DB = process.env.MongoDB.replace(
        '<password>',
        process.env.MongoDB_Password,
    )
}

mongoose
    .connect(DB)
    .then(() => console.log('mongodb is connecting...'))
    .catch((err) => console.log(err.message));
