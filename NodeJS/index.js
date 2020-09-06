const { app } = require('./lib/basic_includes.js');

//Include des API ENDPOINT
require('./api/get_tickets.js');
require('./api/remove_tickets.js');
require('./api/new_solver.js');
require('./api/new_ticket.js');
require('./api/get_chall_id.js');
require('./api/get_vuln_type.js');

//On écoute sur le port
app.listen(3000);