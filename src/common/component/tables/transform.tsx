// utils/offenceDataTransformer.ts

export type GroupedOffence = {
  id: string;
  type: string;
  pending: number;
  taken: number;
  total: number;
  details: Array<{
    srNo: number;
    reportId: string;
    dateTime: string;
    location: string;
    vehicleNumber?: string;
    isVehicleInvolved: boolean;
    reportingMP: string;
    description: string;
    offenders: Array<{
      name: string;
      aadhar?: string;
      fatherName?: string;
    }>;
    actionStatus: 'Pending' | 'Taken';
  }>;
};

export function transformOffenceData(reports: any[]): GroupedOffence[] {
  const groupMap = new Map<string, GroupedOffence>();

  reports.forEach((report, index) => {
    // Handle missing fields safely
    const timeOfOffence = report.offenceOccurenceDetails?.timeOfOffence || report.createdAt;
    const incidentLocation = report.offenceOccurenceDetails?.incidentLocation || 'Not specified';
    const reportingMPName = report.onDutyDetailsMPReporting?.nameReportingMP || 'Unknown';
    const reportingMPRank = report.onDutyDetailsMPReporting?.rank || '';

    const baseDetail = {
      srNo: reports.length - index, // Newest first
      reportId: report._id,
      dateTime: new Date(timeOfOffence).toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      location: incidentLocation,
      vehicleNumber: report.isVehicleInvolved ? report.vehicleNumber : undefined,
      isVehicleInvolved: report.isVehicleInvolved,
      reportingMP: `${reportingMPRank} ${reportingMPName}`.trim(),
      description: report.offenceOccurenceDetails?.description || 'No description',
      offenders: (report.offenders || []).map((o: any) => ({
        name: o.offenderDetails?.name || 'Unknown',
        aadhar: o.offenderDetails?.aadharNumber,
        fatherName: o.offenderDetails?.fatherNameOrHusbandName,
      })),
      actionStatus:
        report.customFields?.paymentStatus === 'Paid' ||
        report.customFields?.caseStatus === 'Closed' ||
        report.customFields?.caseStatus === 'Resolved'
          ? ('Taken' as const)
          : ('Pending' as const),
    };

    const offenceTypes = report.offenceTypes || [];

    offenceTypes.forEach((type: string) => {
      if (!groupMap.has(type)) {
        groupMap.set(type, {
          id: type,
          type: type,
          pending: 0,
          taken: 0,
          total: 0,
          details: [],
        });
      }

      const group = groupMap.get(type)!;
      group.total += 1;
      if (baseDetail.actionStatus === 'Pending') group.pending += 1;
      else group.taken += 1;

      group.details.push({ ...baseDetail });
    });
  });

  // Sort by most frequent offence first
  return Array.from(groupMap.values()).sort((a, b) => b.total - a.total);
}