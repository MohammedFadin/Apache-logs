#!/usr/bin/env node

var fs = require('fs');
var through = require('through');
var path = require('path');
var split = require('split');
var join = require('join-stream');
var filePath = path.join(__dirname, 'logs.txt' || process.argv[2]);
var spawn = require('child_process').spawn;

function beautify (data) {
    this.queue(data.toUpperCase() + ' dummy time requested: '+new Date().getMilliseconds() + 'ms' +  '\n');
}

function it () {
    this.queue('Last data fetched at ' + new Date().getSeconds() + ' seconds' + '\n');
    this.queue(null);
}
process.stdin.setEncoding('utf8');
process.stdin.on('readable', function () {
    var cmd = process.stdin.read();
    if (cmd !== null){
        if (cmd.trim() === 'exit'){
            process.exit(0);
        }
    }

    // console.log(typeof cmd);
    fs.watchFile(filePath, function (curr, prev) {
            var tail = spawn('tail', ['-f', filePath]);
            tail.stdout.on('data', function (data) {
                process.stdout.write('\033c');
                process.stdout.write(data);
            });
            // process.stdin.clearLine();
            // process.stdin.cursorTo(0); // Move to top
            // var discr = fs.createReadStream(filePath,{encoding:'utf8'});
            // discr.pipe(split()).pipe(through(beautify, it)).pipe(process.stdout);
    });
});