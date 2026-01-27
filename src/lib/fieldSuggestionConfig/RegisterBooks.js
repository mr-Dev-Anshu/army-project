export const REGISTER_BOOKS_SUGGESTION_CONFIG = {
    fields: [
        // Vehicle common fields
        'vehicleBaNumber',
        'typeOfVehicle',
        'mobileNumber', // For Mobile Phone Register
        'keyNumber',    // For Key Register
        'weaponType',   // For Arms Register
        'buttNumber',   // For Arms Register
    ],

    nestedFields: {
        // Individual Details (assuming mapped to details.individual in form/payload)
        'details.individual.rank': 'rank',
        'details.individual.unit': 'unit',
        'details.individual.fmn': 'fmn',
        'details.individual.command': 'command',
        'details.individual.unitLocation': 'unitLocation',

        // Duty Details
        'duty.natureOfDuty': 'natureOfDuty',
        'duty.place': 'place',
        'duty.location': 'location',
        'duty.from': 'location', // Suggest locations
        'duty.to': 'location',   // Suggest locations

        // Vehicle Register Fields (Mapped from details)
        'details.natureOfDuty': 'natureOfDuty',
        'details.fromLocation': 'location',
        'details.toLocation': 'location',
        'details.dutyType': 'natureOfDuty',
        'details.typeOfVehicle': 'typeOfVehicle',
        'details.purposeOfDemand': 'purposeOfDemand',
        'details.outSignature.value': 'signature',
        'details.inSignature.value': 'signature',
        'details.outSignature': 'signature',
        'details.inSignature': 'signature',
        'details.vehicleBaNumber': 'vehicleBaNumber',

        // General Duty Diary Fields
        'details.placeOfDuty': 'placeOfDuty',
        'details.typeOfDuty': 'typeOfDuty',
        'details.briefOfDuty': 'briefOfDuty',
        'details.offenceType': 'offenceType',
        'details.placeOfOffence': 'placeOfOffence',
        'details.occurrenceBrief': 'occurrenceBrief',
        'details.totalStrength': 'totalStrength',
        'details.reportNo': 'reportNo',

        // Assigned Individuals
        'details.individuals.armyNo': 'armyNo',
        'details.individuals.rank': 'rank',
        'details.individuals.name': 'name',
        'details.individuals.unit': 'unit',
        'details.individuals.fmn': 'fmn',
        'details.individuals.command': 'command',

        // Authentication Initials
        'authentication.initialsMPCPNCO': 'initials',
        'authentication.initialsQMSJCO': 'initials',
        'authentication.initials2IC': 'initials',

        // Offender / Victim Details
        'details.offenderDetails.rank': 'rank',
        'details.offenderDetails.unit': 'unit',
        'details.offenderDetails.fmn': 'fmn',
        'details.offenderDetails.command': 'command',
        'details.offenderDetails.serviceNumber': 'serviceNumber',
        'details.offenderDetails.iCardNumber': 'iCardNumber',
        'details.offenderDetails.fathersName': 'fathersName',
        'details.offenderDetails.maidPassNumber': 'maidPassNumber',
        'details.offenderDetails.trade': 'trade',
        'details.offenderDetails.quarterNumber': 'quarterNumber',
        'details.offenderDetails.shopOwnerName': 'ownerName',
        'details.offenderDetails.shopAddress': 'address',
        'details.offenderDetails.shopName': 'shopName',
        'details.offenderDetails.passNo': 'passNumber',
        'details.offenderDetails.placeOfStay': 'address',
        'details.offenderDetails.placeOfWork': 'address',
        'details.offenderDetails.typeOfWork': 'trade',
        'details.offenderDetails.name': 'name',
        'details.offenderDetails.address': 'address',
        'details.offenderDetails.aadharCardNumber': 'aadharCardNumber',
        'details.offenderDetails.relationName': 'relationName',

        // Relative Details (Nested in offenderDetails)
        'details.offenderDetails.relativeDetails.armyNo': 'armyNo',
        'details.offenderDetails.relativeDetails.rank': 'rank',
        'details.offenderDetails.relativeDetails.unit': 'unit',
        'details.offenderDetails.relativeDetails.fmn': 'fmn',
        'details.offenderDetails.relativeDetails.command': 'command',
        'details.offenderDetails.relativeDetails.iCardNumber': 'iCardNumber',

        'details.offenderDetails.relativeDetails.maidPassNumber': 'maidPassNumber',
        'details.offenderDetails.relativeDetails.maidFathersName': 'fathersName',
        'details.offenderDetails.relativeDetails.maidPassID': 'passID',
        'details.offenderDetails.relativeDetails.relativeName': 'name',
        'details.offenderDetails.relativeDetails.maidTrade': 'trade',
        'details.offenderDetails.relativeDetails.maidQuarterNumber': 'quarterNumber',
        'details.offenderDetails.relativeDetails.officersEnclaveRank': 'rank',
        'details.offenderDetails.relativeDetails.officersEnclaveName': 'name', // Using 'name' generally
        'details.offenderDetails.relativeDetails.maidPlaceOfQtr': 'placeOfQtr', // or 'address'
        'details.offenderDetails.relativeDetails.maidUnit': 'unit',
        'details.offenderDetails.relativeDetails.maidFmn': 'fmn',
        'details.offenderDetails.relativeDetails.maidCommand': 'command',
        'details.offenderDetails.relativeDetails.relativeAddress': 'address',
        'details.offenderDetails.relativeDetails.maidICardNumber': 'iCardNumber',

        'details.offenderDetails.relativeDetails.shopOwnerName': 'ownerName',
        'details.offenderDetails.relativeDetails.shopAddress': 'address',
        'details.offenderDetails.relativeDetails.shopName': 'shopName',
        'details.offenderDetails.relativeDetails.shopUnit': 'unit',
        'details.offenderDetails.relativeDetails.shopPassNo': 'passNumber',

        'details.offenderDetails.relativeDetails.tempWorkerName': 'name',
        'details.offenderDetails.relativeDetails.tempWorkerPlaceOfStay': 'address',
        'details.offenderDetails.relativeDetails.tempWorkerPlaceOfWork': 'address',
        'details.offenderDetails.relativeDetails.tempWorkerTypeOfWork': 'trade',
        'details.offenderDetails.relativeDetails.tempWorkerPassNo': 'passNumber',


        // Other specific fields that might arise
        'details.remarks': 'remarks',

        // Lost and Found Register
        'details.itemName': 'itemName',
        'details.place': 'place',
        'details.handedByName': 'name',
        'details.caseDetails': 'caseDetails',
        'details.takeoverBy': 'name',
        'details.takeoverAuth.initialsMPCPNCO': 'initials',
        'details.takeoverAuth.initialsQMSJCO': 'initials',
        'details.takeoverAuth.initials2IC': 'initials',

        // Army Help Line Complaints
        'details.relatedPoliceStation': 'relatedPoliceStation',
        'details.mobileNo': 'mobileNumber',
        'details.civilAddress': 'civilAddress',

        // Mini Kote Arms / AMN Register
        'details.typeOfArms': 'typeOfArms',
        'details.buttNo': 'buttNo',
        'details.registrationNo': 'registrationNo',
        'details.typeOfAmn': 'typeOfAmn',

        // Contact Info Army
        'details.rank': 'rank',
        'details.name': 'name',
        'details.mobileNumber': 'mobileNumber',
        'details.appointment': 'appointment',
        'details.unit': 'unit',
        'details.postedAt': 'unitLocation',
        'details.officeLandlineNumber': 'landlineNumber',
        'details.residencyNo': 'landlineNumber',

        // Contact Info Civil Police
        'details.policeStationName': 'policeStation',
        'details.rankOfStation': 'rankOfStation',
        'details.shoName': 'shoName',
        'details.addressOfStation': 'address',
        'details.landmark': 'landmark',
        'details.district': 'district',
        'details.state': 'state',
        'details.stationEmailId': 'email',

        // Military Police Control Room
        'details.locationOfUnit': 'unitLocation',
        'details.unitName': 'unit',
        'details.coName': 'officerName',
        'details.coRank': 'rank',
        'details.coMobileNumber': 'mobileNumber',
        'details.coOfficeLandline': 'landlineNumber',
        'details.coResidencyTelephone': 'landlineNumber',
        'details.ic2Name': 'officerName',
        'details.ic2Rank': 'rank',
        'details.ic2MobileNumber': 'mobileNumber',
        'details.ic2OfficeLandline': 'landlineNumber',
        'details.ic2ResidencyTelephone': 'landlineNumber',
        'details.mpcrEmailId': 'email',
        'details.mpcrMobileNumber': 'mobileNumber',
        'details.mpcrArmyLandline': 'landlineNumber',
        'details.mpcrBsnlLandline': 'landlineNumber',
    },

    arrayFields: {
        'details.assignedDevices.motorolas': 'motorolaId',
        'details.assignedDevices.cameras': 'cameraId',
    },

    trackCustomFields: 'specific',
};
