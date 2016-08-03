var bf = require("../bloomfilter"),
    BloomFilter = bf.BloomFilter,
    fnv_1a = bf.fnv_1a,
    fnv_1a_b = bf.fnv_1a_b;


var f = new BloomFilter(
      32 * 256, // number of bits to allocate.
      16        // number of hash functions.
      );

