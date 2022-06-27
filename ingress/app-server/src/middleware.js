const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');

module.exports = function({app}){
    // enable files upload
    app.use(fileUpload({
        createParentPath: true,
        limits: { 
            fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
        },
    }));
    
    // parse fileupload
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // debug incoming requests
    app.use(morgan('dev'));
}