'use strict' 

var fs = require('fs');
var knox = require('knox');

var amazon = null
/**
 * create client to amazon
 */ 
function connect(opts) {
     return knox.createClient(opts);
}

/**
* upload a file to amazon
**/
function upload (file, filepath, filename) {
    fs.readFile(filepath, function(err, buf){
        amazon.put( filename, {
            'Content-Length': buf.length,
            'Content-Type': file.filetype
        }).end(buf);
    });
}



module.exports = {
    connect: connect,
    upload: upload
}
