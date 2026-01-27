// POST Request Example for General Traffic Offence
// Use this with the x-user-role: superadmin header for bypass authentication

const postRequestData = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-role': 'superadmin' // Bypass header for development
  },
  body: JSON.stringify({
    reportId: "TEMP/REPORT/001",
    isVehicleInvolved: true,
    vehicleCategory: "4-Wheeler",
    vehicleType: "Civilian Vehicle",
    vehicleNumber: "DL-12-AB-1234",
    vehicleName: "Maruti Suzuki Swift",
    driverType: "Owner",
    
    onDutyDetails: {
      dateOfDuty: "2024-01-15T00:00:00.000Z",
      startTime: "2024-01-15T09:00:00.000Z",
      endTime: "2024-01-15T17:00:00.000Z",
      dutyLocation: "NH-48 Highway",
      dutyType: "Traffic Check"
    },
    
    onDutyDetailsMPReporting: {
      nameReportingMP: "John Doe",
      rank: "Sergeant",
      unit: "Traffic Police Unit 3",
      armyNumber: "ARM123456"
    },
    
    offenceOccurenceDetails: {
      timeOfOffence: "2024-01-15T14:30:00.000Z",
      incidentLocation: "NH-48, Near Delhi-Gurgaon Border",
      description: "Vehicle found exceeding speed limit by 30 km/h",
      briefDescription: "Speeding violation"
    },
    
    offenceTypes: ["Speeding", "Overloading"],
    offenceTypeReference: ["Motor Vehicle Act Section 112", "Traffic Regulation 23"],
    actionStatus: false,
    actionStatusRemark: "Fine to be collected",
    
    customFields: {
      fineAmount: 2000,
      courtDate: "2024-02-01",
      witnesses: ["Officer Smith", "Officer Johnson"]
    }
  })
};

// cURL Version
const curlCommand = `curl -X POST http://localhost:3000/api/generalTraficOffence \\
  -H "Content-Type: application/json" \\
  -H "x-user-role: superadmin" \\
  -d '{
    "reportId": "TEMP/REPORT/001",
    "isVehicleInvolved": true,
    "vehicleCategory": "4-Wheeler",
    "vehicleType": "Civilian Vehicle",
    "vehicleNumber": "DL-12-AB-1234",
    "vehicleName": "Maruti Suzuki Swift",
    "driverType": "Owner",
    "onDutyDetails": {
      "dateOfDuty": "2024-01-15T00:00:00.000Z",
      "startTime": "2024-01-15T09:00:00.000Z",
      "endTime": "2024-01-15T17:00:00.000Z",
      "dutyLocation": "NH-48 Highway",
      "dutyType": "Traffic Check"
    },
    "onDutyDetailsMPReporting": {
      "nameReportingMP": "John Doe",
      "rank": "Sergeant",
      "unit": "Traffic Police Unit 3",
      "armyNumber": "ARM123456"
    },
    "offenceOccurenceDetails": {
      "timeOfOffence": "2024-01-15T14:30:00.000Z",
      "incidentLocation": "NH-48, Near Delhi-Gurgaon Border",
      "description": "Vehicle found exceeding speed limit by 30 km/h",
      "briefDescription": "Speeding violation"
    },
    "offenceTypes": ["Speeding", "Overloading"],
    "offenceTypeReference": ["Motor Vehicle Act Section 112", "Traffic Regulation 23"],
    "actionStatus": false,
    "actionStatusRemark": "Fine to be collected",
    "customFields": {
      "fineAmount": 2000,
      "courtDate": "2024-02-01",
      "witnesses": ["Officer Smith", "Officer Johnson"]
    }
  }'`;

// Fetch API Version (for browser/Node.js)
const fetchRequest = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/generalTraficOffence', postRequestData);
    const result = await response.json();
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// Axios Version (if you have axios installed)
const axiosRequest = async () => {
  try {
    const axios = require('axios');
    const response = await axios.post('http://localhost:3000/api/generalTraficOffence', 
      JSON.parse(postRequestData.body), 
      {
        headers: postRequestData.headers
      }
    );
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = {
  postRequestData,
  curlCommand,
  fetchRequest,
  axiosRequest
};
