import Individual from "@/models/individual";

export async function saveOrUpdateArmyPersonnelRepo(individuals) {
    if (!individuals) return;

    // helper to normalise valid array
    const list = Array.isArray(individuals) ? individuals : [individuals];

    if (list.length === 0) return;

    const operations = list
        .filter(ind => ind && ind.armyNo && typeof ind.armyNo === 'string' && ind.armyNo.trim() !== '')
        .map(ind => {
            // map incoming data to model fields to be safe (or pass directly if trusted)
            // Using $set with upsert
            return {
                updateOne: {
                    filter: { armyNo: ind.armyNo.trim() },
                    update: {
                        $set: {
                            rank: ind.rank,
                            name: ind.name,
                            unit: ind.unit,
                            fmn: ind.fmn,
                            command: ind.command,
                            unitLocation: ind.unitLocation,
                            age: ind.age,
                            totalServiceDuration: ind.totalServiceDuration,
                            // Add any other common fields if they exist
                        }
                    },
                    upsert: true
                }
            };
        });

    if (operations.length > 0) {
        try {
            await Individual.bulkWrite(operations);
            console.log(`Upserted ${operations.length} individual records.`);
        } catch (error) {
            console.error("Error upserting individual:", error);
        }
    }
}
