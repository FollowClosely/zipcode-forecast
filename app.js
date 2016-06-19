var path = require('path'),
		express = require('express'),
		zipdb = require('zippity-do-dah'),
		ForecastIo = require('forecastio');

var app = express();
var weather = new ForecastIo('804c16a2d233d55bc98a801a699ee0f5');

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', function(req, res){
	res.render('index');
});

app.get(/^\/(\d{5})$/, function(req, res, next){
	// this line ensures that if an array is sent,
	// only the first value (index[0]) will be passed:
	var zipcode = req.params[0];
	var location = zipdb.zipcode(zipcode);
	if(!location.zipcode) {
		next();
		return;
	}

	var latitude = location.latitude;
	var longitude = location.longitude;

	weather.forecast(latitude, longitude, function(err, data) {
		if(err) {
			next();
			return;
		}

		res.json({
			zipcode: zipcode,
			temperature: data.currently.temperature
		});
	});
});

app.use(function(req, res){
	res.status(404).render('404');
});

app.listen(3000);