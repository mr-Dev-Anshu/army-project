// app/reports/page.tsx
import CollapsibleOffenceTable from '@/common/component/tables/OffendersTable';
import { transformOffenceData } from '@/common/component/tables/transform';

// Your JSON data (from API or static)
const rawReports =[
    {
        "_id": "6949b3dd833d0db112e276e6",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "DL10CR5678",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-22T00:00:00.000Z",
            "startTime": "2025-12-22T14:00:00.000Z",
            "endTime": "2025-12-22T22:00:00.000Z",
            "dutyLocation": "India Gate Checkpoint",
            "dutyType": "Traffic Control Duty",
            "customFields": {
                "shiftType": "Day + Evening",
                "checkpointId": "CKP-IN-45",
                "supervisorName": "Capt. Rajesh Kumar",
                "radarDeviceUsed": "LaserGun-2025"
            },
            "_id": "6949b3dd833d0db112e276e7"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Hav. Mohan Lal",
            "rank": "Havildar",
            "unit": "Delhi Provost Unit",
            "armyNumber": "JC-789012",
            "customFields": {
                "beltNumber": "B-4567",
                "weaponIssued": "Yes",
                "radioSetNumber": "RS-890",
                "bodyCameraOn": true
            },
            "_id": "6949b3dd833d0db112e276e8"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-22T18:45:00.000Z",
            "incidentLocation": "Near India Gate Circle",
            "description": "Vehicle crossed red light and was driving recklessly at high speed.",
            "customFields": {
                "weatherCondition": "Clear",
                "trafficDensity": "High",
                "witnessesPresent": 3,
                "videoEvidence": true,
                "dashcamFootage": false,
                "roadCondition": "Dry"
            },
            "_id": "6949b3dd833d0db112e276e9"
        },
        "offenceTypes": [
            "Red Light Jumping",
            "Rash Driving",
            "Over Speeding"
        ],
        "offenceTypeReference": [
            "Section 119/177 MV Act",
            "Section 184 MV Act"
        ],
        "customFields": {
            "challanNumber": "DL-PROV-2025-001234",
            "fineAmount": 5000,
            "paymentStatus": "Pending",
            "caseStatus": "Under Process",
            "officerRemarks": "Driver was not cooperative initially but later apologized.",
            "evidenceUploaded": true,
            "followUpRequired": true
        },
        "createdAt": "2025-12-22T21:10:53.842Z",
        "updatedAt": "2025-12-22T21:10:53.842Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "69490a43a7a91f1b59d109ec",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "DL10CR5678",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-22T00:00:00.000Z",
            "startTime": "2025-12-22T14:00:00.000Z",
            "endTime": "2025-12-22T22:00:00.000Z",
            "dutyLocation": "India Gate Checkpoint",
            "dutyType": "Traffic Control Duty",
            "customFields": {
                "shiftType": "Day + Evening",
                "checkpointId": "CKP-IN-45",
                "supervisorName": "Capt. Rajesh Kumar",
                "radarDeviceUsed": "LaserGun-2025"
            },
            "_id": "69490a43a7a91f1b59d109ed"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Hav. Mohan Lal",
            "rank": "Havildar",
            "unit": "Delhi Provost Unit",
            "armyNumber": "JC-789012",
            "customFields": {
                "beltNumber": "B-4567",
                "weaponIssued": "Yes",
                "radioSetNumber": "RS-890",
                "bodyCameraOn": true
            },
            "_id": "69490a43a7a91f1b59d109ee"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-22T18:45:00.000Z",
            "incidentLocation": "Near India Gate Circle",
            "description": "Vehicle crossed red light and was driving recklessly at high speed.",
            "customFields": {
                "weatherCondition": "Clear",
                "trafficDensity": "High",
                "witnessesPresent": 3,
                "videoEvidence": true,
                "dashcamFootage": false,
                "roadCondition": "Dry"
            },
            "_id": "69490a43a7a91f1b59d109ef"
        },
        "offenceTypes": [
            "Red Light Jumping",
            "Rash Driving",
            "Over Speeding"
        ],
        "offenceTypeReference": [
            "Section 119/177 MV Act",
            "Section 184 MV Act"
        ],
        "customFields": {
            "challanNumber": "DL-PROV-2025-001234",
            "fineAmount": 5000,
            "paymentStatus": "Pending",
            "caseStatus": "Under Process",
            "officerRemarks": "Driver was not cooperative initially but later apologized.",
            "evidenceUploaded": true,
            "followUpRequired": true
        },
        "createdAt": "2025-12-22T09:07:15.971Z",
        "updatedAt": "2025-12-22T09:07:15.971Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "694909fb4301aef45852c7ba",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "DL10CR5678",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-22T00:00:00.000Z",
            "startTime": "2025-12-22T14:00:00.000Z",
            "endTime": "2025-12-22T22:00:00.000Z",
            "dutyLocation": "India Gate Checkpoint",
            "dutyType": "Traffic Control Duty",
            "_id": "694909fb4301aef45852c7bb"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Hav. Mohan Lal",
            "rank": "Havildar",
            "unit": "Delhi Provost Unit",
            "armyNumber": "JC-789012",
            "_id": "694909fb4301aef45852c7bc"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-22T18:45:00.000Z",
            "incidentLocation": "Near India Gate Circle",
            "description": "Vehicle crossed red light and was driving recklessly at high speed.",
            "_id": "694909fb4301aef45852c7bd"
        },
        "offenceTypes": [
            "Red Light Jumping",
            "Rash Driving",
            "Over Speeding"
        ],
        "offenceTypeReference": [
            "Section 119/177 MV Act",
            "Section 184 MV Act"
        ],
        "createdAt": "2025-12-22T09:06:03.882Z",
        "updatedAt": "2025-12-22T09:06:03.882Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "694909f14301aef45852c7b5",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "DL10CR5678",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-22T00:00:00.000Z",
            "startTime": "2025-12-22T14:00:00.000Z",
            "endTime": "2025-12-22T22:00:00.000Z",
            "dutyLocation": "India Gate Checkpoint",
            "dutyType": "Traffic Control Duty",
            "_id": "694909f14301aef45852c7b6"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Hav. Mohan Lal",
            "rank": "Havildar",
            "unit": "Delhi Provost Unit",
            "armyNumber": "JC-789012",
            "_id": "694909f14301aef45852c7b7"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-22T18:45:00.000Z",
            "incidentLocation": "Near India Gate Circle",
            "description": "Vehicle crossed red light and was driving recklessly at high speed.",
            "_id": "694909f14301aef45852c7b8"
        },
        "offenceTypes": [
            "Red Light Jumping",
            "Rash Driving",
            "Over Speeding"
        ],
        "offenceTypeReference": [
            "Section 119/177 MV Act",
            "Section 184 MV Act"
        ],
        "createdAt": "2025-12-22T09:05:53.898Z",
        "updatedAt": "2025-12-22T09:05:53.898Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "6949092d4301aef45852c7b0",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "DL10CR5678",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-22T00:00:00.000Z",
            "startTime": "2025-12-22T14:00:00.000Z",
            "endTime": "2025-12-22T22:00:00.000Z",
            "dutyLocation": "India Gate Checkpoint",
            "dutyType": "Traffic Control Duty",
            "_id": "6949092d4301aef45852c7b1"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Hav. Mohan Lal",
            "rank": "Havildar",
            "unit": "Delhi Provost Unit",
            "armyNumber": "JC-789012",
            "_id": "6949092d4301aef45852c7b2"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-22T18:45:00.000Z",
            "incidentLocation": "Near India Gate Circle",
            "description": "Vehicle crossed red light and was driving recklessly at high speed.",
            "_id": "6949092d4301aef45852c7b3"
        },
        "offenceTypes": [
            "Red Light Jumping",
            "Rash Driving",
            "Over Speeding"
        ],
        "offenceTypeReference": [
            "Section 119/177 MV Act",
            "Section 184 MV Act"
        ],
        "createdAt": "2025-12-22T09:02:37.112Z",
        "updatedAt": "2025-12-22T09:02:37.112Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "6949089f4301aef45852c7aa",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "DL10CR5678",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-22T00:00:00.000Z",
            "startTime": "2025-12-22T14:00:00.000Z",
            "endTime": "2025-12-22T22:00:00.000Z",
            "dutyLocation": "India Gate Checkpoint",
            "dutyType": "Traffic Control Duty",
            "_id": "6949089f4301aef45852c7ab"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Hav. Mohan Lal",
            "rank": "Havildar",
            "unit": "Delhi Provost Unit",
            "armyNumber": "JC-789012",
            "_id": "6949089f4301aef45852c7ac"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-22T18:45:00.000Z",
            "incidentLocation": "Near India Gate Circle",
            "description": "Vehicle crossed red light and was driving recklessly at high speed.",
            "_id": "6949089f4301aef45852c7ad"
        },
        "offenceTypes": [
            "Red Light Jumping",
            "Rash Driving",
            "Over Speeding"
        ],
        "offenceTypeReference": [
            "Section 119/177 MV Act",
            "Section 184 MV Act"
        ],
        "createdAt": "2025-12-22T09:00:15.762Z",
        "updatedAt": "2025-12-22T09:00:15.762Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "6945b00b57352a6d3a98d359",
        "isVehicleInvolved": false,
        "onDutyDetails": {
            "dateOfDuty": "2025-12-19T00:00:00.000Z",
            "startTime": "2025-12-19T16:00:00.000Z",
            "endTime": "2025-12-20T00:00:00.000Z",
            "dutyLocation": "Market2 Area Patrol",
            "dutyType": "Evening222 Foot Patrol",
            "_id": "6945b00b57352a6d3a98d35a"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Sep. Manoj Yadav",
            "rank": "Sepoy",
            "unit": "105 MP Detachment",
            "armyNumber": "OR-901234",
            "_id": "6945b00b57352a6d3a98d35b"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-19T19:20:00.000Z",
            "incidentLocation": "Cantonment Market Road",
            "description": "Civilian found smoking in prohibited area and littering in restricted zone.",
            "_id": "6945b00b57352a6d3a98d35c"
        },
        "offenceTypes": [
            "Smoking in Prohibited Area",
            "Littering"
        ],
        "offenceTypeReference": [
            "SPA-07",
            "LIT-01"
        ],
        "createdAt": "2025-12-19T20:05:31.720Z",
        "updatedAt": "2025-12-19T20:05:31.720Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "694590ed9f0109a486cdd064",
        "isVehicleInvolved": false,
        "onDutyDetails": {
            "dateOfDuty": "2025-12-19T00:00:00.000Z",
            "startTime": "2025-12-19T16:00:00.000Z",
            "endTime": "2025-12-20T00:00:00.000Z",
            "dutyLocation": "Market2 Area Patrol",
            "dutyType": "Evening222 Foot Patrol",
            "_id": "694592899f0109a486cdd06e"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Sep. Manoj Yadav",
            "rank": "Sepoy",
            "unit": "105 MP Detachment",
            "armyNumber": "OR-901234",
            "_id": "694592899f0109a486cdd06f"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-19T19:20:00.000Z",
            "incidentLocation": "Cantonment Market Road",
            "description": "Civilian found smoking in prohibited area and littering in restricted zone.",
            "_id": "694592899f0109a486cdd070"
        },
        "offenceTypes": [
            "Smoking in Prohibited Area",
            "Littering"
        ],
        "offenceTypeReference": [
            "SPA-07",
            "LIT-01"
        ],
        "createdAt": "2025-12-19T17:52:45.601Z",
        "updatedAt": "2025-12-19T17:59:37.828Z",
        "__v": 0,
        "offenders": [
            {
                "_id": "6945a08957352a6d3a98d352",
                "offenceId": "694590ed9f0109a486cdd064",
                "offenderType": "Civilian",
                "offenderDetails": {
                    "name": "Amit Kumari Sharma",
                    "fatherNameOrHusbandName": "Ramesh Sharma",
                    "address": "House No. 45, Sector 12, Noida, Uttar Pradesh",
                    "aadharNumber": "1234-5678-9012"
                },
                "createdAt": "2025-12-19T18:59:21.607Z",
                "updatedAt": "2025-12-19T18:59:21.607Z",
                "__v": 0
            },
            {
                "_id": "6945afa657352a6d3a98d356",
                "offenceId": "694590ed9f0109a486cdd064",
                "offenderType": "Civilian",
                "offenderDetails": {
                    "name": "Amit Kumari Sharma",
                    "fatherNameOrHusbandName": "Ramesh Sharma",
                    "address": "House No. 45, Sector 12, Noida, Uttar Pradesh",
                    "aadharNumber": "1234-5678-9012"
                },
                "createdAt": "2025-12-19T20:03:50.077Z",
                "updatedAt": "2025-12-19T20:03:50.077Z",
                "__v": 0
            }
        ],
        "onDutyWitnessingMps": [
            {
                "_id": "6945a01d57352a6d3a98d34d",
                "offenceId": "694590ed9f0109a486cdd064",
                "rank": "Naik",
                "unit": "105 MP Detachment",
                "ArmyNo": "JC-456789",
                "__v": 0
            },
            {
                "_id": "6945b07557352a6d3a98d35f",
                "offenceId": "694590ed9f0109a486cdd064",
                "rank": "Naik",
                "unit": "105 MP Detachment",
                "ArmyNo": "JC-456789",
                "__v": 0
            }
        ],
        "offendersCount": 2,
        "witnessingMpsCount": 2
    },
    {
        "_id": "694584f8e63aa608fbb1fdd7",
        "isVehicleInvolved": false,
        "onDutyDetails": {
            "dateOfDuty": "2025-12-19T00:00:00.000Z",
            "startTime": "2025-12-19T16:00:00.000Z",
            "endTime": "2025-12-20T00:00:00.000Z",
            "dutyLocation": "Market Area Patrol",
            "dutyType": "Evening Foot Patrol",
            "_id": "694584f8e63aa608fbb1fdd8"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Sep. Manoj Yadav",
            "rank": "Sepoy",
            "unit": "105 MP Detachment",
            "armyNumber": "OR-901234",
            "_id": "694584f8e63aa608fbb1fdd9"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-19T19:20:00.000Z",
            "incidentLocation": "Cantonment Market Road",
            "description": "Civilian found smoking in prohibited area and littering in restricted zone.",
            "_id": "694584f8e63aa608fbb1fdda"
        },
        "offenceTypes": [
            "Smoking in Prohibited Area",
            "Littering"
        ],
        "offenceTypeReference": [
            "SPA-07",
            "LIT-01"
        ],
        "createdAt": "2025-12-19T17:01:44.225Z",
        "updatedAt": "2025-12-19T17:01:44.225Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    },
    {
        "_id": "69456ec92af7bf48cb1ee85c",
        "isVehicleInvolved": false,
        "onDutyDetails": {
            "dateOfDuty": "2025-12-19T00:00:00.000Z",
            "startTime": "2025-12-19T16:00:00.000Z",
            "endTime": "2025-12-20T00:00:00.000Z",
            "dutyLocation": "Market Area Patrol",
            "dutyType": "Evening Foot Patrol",
            "_id": "69456ec92af7bf48cb1ee85d"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Sep. Manoj Yadav",
            "rank": "Sepoy",
            "unit": "105 MP Detachment",
            "armyNumber": "OR-901234",
            "_id": "69456ec92af7bf48cb1ee85e"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-19T19:20:00.000Z",
            "incidentLocation": "Cantonment Market Road",
            "description": "Civilian found smoking in prohibited area and littering in restricted zone.",
            "_id": "69456ec92af7bf48cb1ee85f"
        },
        "offenceTypes": [
            "Smoking in Prohibited Area",
            "Littering"
        ],
        "offenceTypeReference": [
            "SPA-07",
            "LIT-01"
        ],
        "createdAt": "2025-12-19T15:27:05.463Z",
        "updatedAt": "2025-12-19T15:27:05.463Z",
        "__v": 0,
        "offenders": [
            {
                "_id": "6945811ac823e9ea4505e90a",
                "offenceId": "69456ec92af7bf48cb1ee85c",
                "offenderType": "Civilian",
                "offenderDetails": {
                    "name": "Amit Kumar Sharma",
                    "fatherNameOrHusbandName": "Ramesh Sharma",
                    "address": "House No. 45, Sector 12, Noida, Uttar Pradesh",
                    "aadharNumber": "1234-5678-9012"
                },
                "createdAt": "2025-12-19T16:45:14.226Z",
                "updatedAt": "2025-12-19T16:45:14.226Z",
                "__v": 0
            }
        ],
        "onDutyWitnessingMps": [],
        "offendersCount": 1,
        "witnessingMpsCount": 0
    },
    {
        "_id": "69456ebe2af7bf48cb1ee857",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "HR26DQ5678",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-19T00:00:00.000Z",
            "startTime": "2025-12-19T06:00:00.000Z",
            "endTime": "2025-12-19T14:00:00.000Z",
            "dutyLocation": "Traffic Point Alpha",
            "dutyType": "Morning Traffic Control",
            "_id": "69456ebe2af7bf48cb1ee858"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "L/Nk Vijay Pratap",
            "rank": "Lance Naik",
            "unit": "102 MP Det",
            "armyNumber": "OR-345678",
            "_id": "69456ebe2af7bf48cb1ee859"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-19T09:15:00.000Z",
            "incidentLocation": "Junction near CSD Canteen",
            "description": "Civilian SUV jumped red signal and was driving rashly, endangering pedestrians.",
            "_id": "69456ebe2af7bf48cb1ee85a"
        },
        "offenceTypes": [
            "Signal Jumping",
            "Rash and Negligent Driving"
        ],
        "offenceTypeReference": [
            "SJ-05",
            "RND-02"
        ],
        "createdAt": "2025-12-19T15:26:54.269Z",
        "updatedAt": "2025-12-19T15:26:54.269Z",
        "__v": 0,
        "offenders": [
            {
                "_id": "69458251e63aa608fbb1fdd4",
                "offenceId": "69456ebe2af7bf48cb1ee857",
                "offenderType": "Civilian",
                "offenderDetails": {
                    "name": "Amit Kumar Sharma",
                    "fatherNameOrHusbandName": "Ramesh Sharma",
                    "address": "House No. 45, Sector 12, Noida, Uttar Pradesh",
                    "aadharNumber": "1234-5678-9012"
                },
                "createdAt": "2025-12-19T16:50:25.286Z",
                "updatedAt": "2025-12-19T16:50:25.286Z",
                "__v": 0
            }
        ],
        "onDutyWitnessingMps": [],
        "offendersCount": 1,
        "witnessingMpsCount": 0
    },
    {
        "_id": "69456eb42af7bf48cb1ee852",
        "isVehicleInvolved": true,
        "vehicleCategory": "2-Wheeler",
        "vehicleType": "DD Vehicle",
        "vehicleNumber": "Army-21B-123456",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-18T00:00:00.000Z",
            "startTime": "2025-12-18T18:00:00.000Z",
            "endTime": "2025-12-19T02:00:00.000Z",
            "dutyLocation": "Cantonment Main Entrance",
            "dutyType": "Night Patrol Duty",
            "_id": "69456eb42af7bf48cb1ee853"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Hav. Surendra Singh",
            "rank": "Havildar",
            "unit": "108 MP Unit",
            "armyNumber": "JC-789012",
            "_id": "69456eb42af7bf48cb1ee854"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-18T22:45:00.000Z",
            "incidentLocation": "In front of HQ Building",
            "description": "DD motorcycle parked in restricted area during night hours without permission.",
            "_id": "69456eb42af7bf48cb1ee855"
        },
        "offenceTypes": [
            "Unauthorized Parking",
            "Parking in Restricted Zone"
        ],
        "offenceTypeReference": [
            "UP-04",
            "RZ-01"
        ],
        "createdAt": "2025-12-19T15:26:44.410Z",
        "updatedAt": "2025-12-19T18:58:31.408Z",
        "__v": 0,
        "offenders": [
            {
                "_id": "694590149f0109a486cdd061",
                "offenceId": "69456eb42af7bf48cb1ee852",
                "offenderType": "Civilian",
                "offenderDetails": {
                    "name": "Amit Kumar Sharma",
                    "fatherNameOrHusbandName": "Ramesh Sharma",
                    "address": "House No. 45, Sector 12, Noida, Uttar Pradesh",
                    "aadharNumber": "1234-5678-9012"
                },
                "createdAt": "2025-12-19T17:49:08.082Z",
                "updatedAt": "2025-12-19T17:49:08.082Z",
                "__v": 0
            }
        ],
        "onDutyWitnessingMps": [
            {
                "_id": "6945b0cf57352a6d3a98d363",
                "offenceId": "69456eb42af7bf48cb1ee852",
                "rank": "Naik",
                "unit": "105 MP Detachment",
                "ArmyNo": "JC-456789",
                "__v": 0
            }
        ],
        "offendersCount": 1,
        "witnessingMpsCount": 1
    },
    {
        "_id": "69456e812af7bf48cb1ee84d",
        "isVehicleInvolved": true,
        "vehicleCategory": "4-Wheeler",
        "vehicleType": "Civilian Vehicle",
        "vehicleNumber": "DL14CQ1234",
        "onDutyDetails": {
            "dateOfDuty": "2025-12-19T00:00:00.000Z",
            "startTime": "2025-12-19T08:00:00.000Z",
            "endTime": "2025-12-19T16:00:00.000Z",
            "dutyLocation": "Main Gate Checkpost",
            "dutyType": "Traffic Duty",
            "_id": "69456e812af7bf48cb1ee84e"
        },
        "onDutyDetailsMPReporting": {
            "nameReportingMP": "Nk Rajesh Kumar",
            "rank": "Naik",
            "unit": "105 MP Detachment",
            "armyNumber": "JC-456789",
            "_id": "69456e812af7bf48cb1ee84f"
        },
        "offenceOccurenceDetails": {
            "timeOfOffence": "2025-12-19T11:30:00.000Z",
            "incidentLocation": "Near Officers Mess",
            "description": "Vehicle parked in No Parking zone and driver was overspeeding inside cantonment area.",
            "_id": "69456e812af7bf48cb1ee850"
        },
        "offenceTypes": [
            "Wrong Parking",
            "Overspeeding",
            "Disobeying Traffic Signals"
        ],
        "offenceTypeReference": [
            "WP-01",
            "OS-02",
            "DTS-03"
        ],
        "createdAt": "2025-12-19T15:25:53.607Z",
        "updatedAt": "2025-12-19T15:25:53.607Z",
        "__v": 0,
        "offenders": [],
        "onDutyWitnessingMps": [],
        "offendersCount": 0,
        "witnessingMpsCount": 0
    }
]

const groupedData = transformOffenceData(rawReports);

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Offence Reports Dashboard
        </h1>

        <div className="mb-4 text-sm text-gray-600">
          Total Reports: <span className="font-bold">{rawReports.length}</span> | 
          Unique Offence Types: <span className="font-bold">{groupedData.length}</span>
        </div>

        <CollapsibleOffenceTable data={groupedData} />
      </div>
    </div>
  );
}