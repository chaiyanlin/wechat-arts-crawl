var WxPublicAgent = require('./modules/wx_public_agent.js');
var rimraf        = require('rimraf');


//clean old output file...
rimraf('./out', function(err){
	if ( err )
		console.log('Failed to remove out directory...');
	else
		console.log('Out directory has been removed...');
});

var wxPublicAgent = new WxPublicAgent();
wxPublicAgent.init('oIWsFt_7-8ec_bnlrxWNBX-N0rMI', '1kKFQtkEe38bkOXdBU-9HHzkvEMBVqJTdtFh3OdiKZmMzvRmCp7Z8jRZAkjq5DnM');
wxPublicAgent.queryArtsInfo();