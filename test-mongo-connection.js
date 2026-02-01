const mongoose = require('mongoose');

// Candidate 1: Old style
const uri1 = "mongodb://admin-gaurav:gauravSingH@cluster0-shard-00-00.f9fyg.mongodb.net:27017,cluster0-shard-00-01.f9fyg.mongodb.net:27017,cluster0-shard-00-02.f9fyg.mongodb.net:27017/armyProject?ssl=true&authSource=admin";

// Candidate 2: New style (sometimes used) - unlikely without "ac" prefix mapping but worth a shot if mapped differently
// Let's stick to uri1 first.

async function testConnect() {
    console.log("Testing connection with Standard URI (No SRV)...");
    try {
        await mongoose.connect(uri1, {
            serverSelectionTimeoutMS: 5000
        });
        console.log("SUCCESS: Connected with standard URI!");
        process.exit(0);
    } catch (err) {
        console.error("FAILED with standard URI:", err.message);
        process.exit(1);
    }
}

testConnect();
