if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
const sequelize = require('./config/db');
const app = require('./server');
require('./models/Admin');
require('./models/User');
require('./models/Deliverer');
require('./models/Item');
require('./models/Order');
require('./models/Subscription');
require('./models/Notification');
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
