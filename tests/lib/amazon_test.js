var test = require('tape');
var amazon = require('../../lib/amazon');
var amazonConfig = require('../../config/amazon');

test('amazon connection', function (t) {
    t.plan(1);
    
    client = amazon.connect(amazonConfig);
    console.log(client);
    t.ok(client);
});

