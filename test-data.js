const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGO_URI;

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Get the latest offence
    const db = mongoose.connection.db;
    const offences = db.collection('offences');
    const offenders = db.collection('offenders');

    const latestOffence = await offences.findOne({}, { sort: { createdAt: -1 } });
    console.log('\n=== Latest Offence ===');
    console.log(JSON.stringify(latestOffence, null, 2));

    if (latestOffence) {
      const offenderData = await offenders.find({ offenceId: latestOffence._id }).toArray();
      console.log('\n=== Related Offenders ===');
      console.log(JSON.stringify(offenderData, null, 2));
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();
