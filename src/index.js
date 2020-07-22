const path = require('path');
require('dotenv').config({
	path: path.join(__dirname, '.env'),
});
const sequelize = require('./config/db');
const app = require('./server');
require('./models/User');
require('./models/Item');
require('./models/Order');
async function main() {
	try {
		await sequelize.sync();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}

	app.listen(process.env.PORT, () =>
		console.log('Listening on port', process.env.PORT)
	);
}

main();
