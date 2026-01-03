// services/analysis/domestic.service.js

import { GeneralTrafficOffence } from "@/models/GeneralTraficOffence";
import { MPReport } from "@/models/InvestigationReport";
import { StaticSpeedCheckRecord } from "@/models/StaticSpeedCheckRecord";


export const getDomesticAnalytics = async ({ month, year, offenceType }) => {
  // Validate required parameters
  if (!month || !year) {
    throw new Error("Month and year are required");
  }

  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    throw new Error("Invalid month: must be 1-12");
  }
  if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
    throw new Error("Invalid year");
  }

  try {
    // Define date range for the entire month
    const startDate = new Date(yearNum, monthNum - 1, 1, 0, 0, 0); // 1st day, 00:00:00
    const endDate = new Date(yearNum, monthNum, 1, 0, 0, 0);     // 1st of next month

    // Base match filter for the month
    const dateFilter = {
      $gte: startDate,
      $lt: endDate,
    };

    // 1. Fetch MP Reports
    const mpMatch = {
      "occurrenceDetails.dateOfOccurrence": dateFilter,
    };
    if (offenceType) {
      mpMatch["occurrenceDetails.offenceType"] = offenceType;
    }

    const mpReports = await MPReport.find(mpMatch, {
      "occurrenceDetails.offenceType": 1,
      "occurrenceDetails.dateOfOccurrence": 1,
    }).lean();

    // 2. Fetch General Traffic Offences
    const gtMatch = {
      createdAt: dateFilter,
    };
    if (offenceType) {
      gtMatch.offenceTypes = offenceType;
    }

    const generalTraffic = await GeneralTrafficOffence.find(gtMatch, {
      offenceTypes: 1,
      actionStatus: 1,
      createdAt: 1,
    }).lean();

    // 3. Fetch Static Speed Checks
    const ssMatch = {
      createdAt: dateFilter,
    };
    if (offenceType) {
      ssMatch.offenceType = offenceType;
    }

    const staticSpeed = await StaticSpeedCheckRecord.find(ssMatch, {
      offenceType: 1,
      actionStatus: 1,
      createdAt: 1,
    }).lean();

    // Initialize grouping
    const groupedByOffence = {};

    const normalize = (type) => type?.trim() || null;

    // Process MP Reports
    mpReports.forEach((doc) => {
      const type = normalize(doc.occurrenceDetails?.offenceType);
      if (type) {
        if (!groupedByOffence[type]) {
          groupedByOffence[type] = {
            total: 0,
            actionTaken: 0,
            actionPending: 0,
          };
        }
        groupedByOffence[type].total += 1;
        // MP Reports typically don't have actionStatus → count as pending
        groupedByOffence[type].actionPending += 1;
      }
    });

    // Process General Traffic (multiple types possible)
    generalTraffic.forEach((doc) => {
      if (Array.isArray(doc.offenceTypes)) {
        doc.offenceTypes.forEach((rawType) => {
          const type = normalize(rawType);
          if (type) {
            if (!groupedByOffence[type]) {
              groupedByOffence[type] = {
                total: 0,
                actionTaken: 0,
                actionPending: 0,
              };
            }
            groupedByOffence[type].total += 1;

            if (doc.actionStatus === true) {
              groupedByOffence[type].actionTaken += 1;
            } else {
              groupedByOffence[type].actionPending += 1;
            }
          }
        });
      }
    });

    // Process Static Speed
    staticSpeed.forEach((doc) => {
      const type = normalize(doc.offenceType);
      if (type) {
        if (!groupedByOffence[type]) {
          groupedByOffence[type] = {
            total: 0,
            actionTaken: 0,
            actionPending: 0,
          };
        }
        groupedByOffence[type].total += 1;

        if (doc.actionStatus === true) {
          groupedByOffence[type].actionTaken += 1;
        } else {
          groupedByOffence[type].actionPending += 1;
        }
      }
    });

    // Convert to sorted array
    const result = Object.entries(groupedByOffence)
      .map(([offenceType, stats]) => ({
        offenceType,
        total: stats.total,
        actionTaken: stats.actionTaken,
        actionPending: stats.actionPending,
      }))
      .sort((a, b) => b.total - a.total);

    return result;
  } catch (error) {
    console.error("Error in getDomesticAnalytics:", error);
    throw new Error("Failed to fetch domestic analytics for the specified month");
  }
};