var express = require('express');
var app = express();

app.use('/', express.static('dist'));

app.use('/healthcheck', require('express-healthcheck')({
    healthy: function () {
        return {
            everything: 'is ok'
        };
    }
}));

app.listen(process.env.PORT || 3000, function () {console.log('Example app listening on port 3000!');});

