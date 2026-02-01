
const { generalTrafficOffenceService } = require('./src/services/generalTrafficOffence.service');
const { connectDB } = require('./src/lib/db/mongodb');

async function test() {
    try {
        await connectDB();
        console.log("Connected to DB");

        const data = {
            isVehicleInvolved: true,
            vehicleCategory: "2-Wheeler",
            vehicleType: "Civilian Vehicle",
            vehicleNumber: "TEST-123",
            offenceTypes: ["Over Speeding"]
        };

        console.log("Creating offence...");
        const result = await generalTrafficOffenceService.create(data);
        console.log("Result:", result);
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

test();
