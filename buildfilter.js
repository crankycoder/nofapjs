var fs = require('fs');

var bf = require("./bloomfilter.js"),
    BloomFilter = bf.BloomFilter,
    fnv_1a = bf.fnv_1a,
    fnv_1a_b = bf.fnv_1a_b;


if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}


var domains = [];

fs.readFileSync('./domain_blocklist.txt').toString().split('\n').forEach(function (line) { 
    if (line.indexOf("\/\/") == 0) {
        return;
    }

    var foo = line.trim();

    if (foo.length == 0) {
        return;
    }

    domains.push(foo);
    console.log("pushed: " + foo);
});


var n = domains.length * 1.1;  // Expected # of items
var p = 0.0001; // 0.01% desired false positive rate

console.log("n = " + n);
console.log("p = " + p);

// Compute the number of buckets and hash functions
var m = Math.ceil(-n*Math.log(p) / (Math.pow(Math.log(2), 2))); // the number of bits
var k = Math.ceil(m/n * Math.log(2));  // the number of hash functions

console.log("Bloomfilter: m = " + m);
console.log("Bloomfilter: k = " + k);

var filter = new BloomFilter(m, k);

for (var d in domains) {
    var domain = domains[d];
    filter.add(domain);
    //console.log("filter added: " + domain);
}

var array = [].slice.call(filter.buckets),
json = JSON.stringify(array);

// Save the JSON
fs.writeFile("pornfilter.bfilter", json, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 

// Load the JSON
fs.readFile("pornfilter.bfilter", 'utf8', function(err, data) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was loaded!");
    var array = JSON.parse(data);

    var bloom = new BloomFilter(array, k);

    console.log("007angels.com " + bloom.test("007angels.com"));
    console.log("zubehost.com " + bloom.test("zubehost.com"));
    console.log("fdsaztod.com " + bloom.test("fdsaztod.com"));
    console.log("amazon.com " + bloom.test("amazon.com"));
}); 
