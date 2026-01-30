"use client";

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import ReportsCard from "@/common/component/cards/ReportsCard";
import { useGetAllTrafficOffences } from "@/features/generalTraficOffence/hooks";
import { useGetStaticSpeedRecords } from "@/features/staticSpeed/hooks";
import { useGetAllMPReports } from "@/features/mpReports/hooks";
import { useGetAllImmediateReportingIncidents } from "@/features/immediateReportingIncident/hooks"; // Import the hook
import { useRouter } from "next/navigation";
import ReportPageHeader from "@/components/common/ReportPageHeader";

export default function AllRegisteredReports() {
  const router = useRouter();

  // 1. General Traffic Offences
  const { data: trafficData, isLoading: trafficLoading } =
    useGetAllTrafficOffences({ groupBy: "offenceType" });

  // 2. Static Speed Checks
  const { data: speedData, isLoading: speedLoading } =
    useGetStaticSpeedRecords();

  // 3. MP Reports
  const { data: mpData, isLoading: mpLoading } = useGetAllMPReports();

  // 4. Immediate Reporting Incidents
  const { data: immediateData, isLoading: immediateLoading } = useGetAllImmediateReportingIncidents();

  // Compute Counts
  const counts = useMemo(() => {
    let trafficVehicle = 0;
    let trafficNoVehicle = 0;

    if (trafficData) {
      trafficData.forEach((group: any) => {
        const offences = group.offences || [];
        trafficVehicle += offences.filter(
          (o: any) => o.isVehicleInvolved
        ).length;
        trafficNoVehicle += offences.filter(
          (o: any) => !o.isVehicleInvolved
        ).length;
      });
    }

    return {
      trafficVehicle,
      trafficNoVehicle,
      staticSpeed: speedData?.length || 0,
      mpOccurrence: mpData?.length || 0,
      immediateIncident: immediateData?.length || 0, // Add count here
      mtAccident: 56, // Mock data
    };
  }, [trafficData, speedData, mpData, immediateData]);

  const isLoading = trafficLoading || speedLoading || mpLoading || immediateLoading;

  const reportCards = [
    {
      title: "(Initial Report) Immediate Reporting of Incident",
      count: counts.immediateIncident, // Use dynamic count
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="24" fill="#FF9933" />
          <path d="M19 24C19 22.6739 19.5268 21.4021 20.4645 20.4645C21.4021 19.5268 22.6739 19 24 19C25.3261 19 26.5979 19.5268 27.5355 20.4645C28.4732 21.4021 29 22.6739 29 24V30H19V24Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 32C17 31.4696 17.2107 30.9609 17.5858 30.5858C17.9609 30.2107 18.4696 30 19 30H29C29.5304 30 30.0391 30.2107 30.4142 30.5858C30.7893 30.9609 31 31.4696 31 32V34H17V32Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M33 24H34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30.5 16.5L30 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 24H15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 14V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.9297 16.9297L17.6367 17.6367" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 24V30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      ),
      iconBgColor: "bg-[#FF9933]",
      onClick: () =>
        router.push("/reports/immediate-reporting-incident"),
    },
    {
      title: "General & Traffic Offence Reports - No Vehicle Involved",
      count: counts.trafficNoVehicle,
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="24" fill="#1C2E4A" />
          <path
            d="M28.7234 22.7937C28.1826 23.1672 27.4724 23.4713 26.6511 23.6809C25.8297 23.8906 24.9206 23.9999 23.9984 23.9999C23.0762 23.9999 22.1672 23.8906 21.3458 23.6809C20.5245 23.4713 19.8142 23.1672 19.2734 22.7937"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29.7428 26.3905L34.9695 28.7705C35.1769 28.8615 35.3534 29.0109 35.4773 29.2005C35.6012 29.3901 35.6673 29.6117 35.6674 29.8382C35.6675 30.0647 35.6017 30.2864 35.478 30.4761C35.3543 30.6658 35.178 30.8154 34.9707 30.9067L24.9677 35.4567C24.6637 35.5953 24.3335 35.6671 23.9993 35.6671C23.6652 35.6671 23.335 35.5953 23.031 35.4567L13.028 30.895C12.821 30.8037 12.645 30.6542 12.5214 30.4647C12.3978 30.2751 12.332 30.0538 12.332 29.8275C12.332 29.6012 12.3978 29.3799 12.5214 29.1903C12.645 29.0008 12.821 28.8513 13.028 28.76L18.2593 26.38"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29.7724 26.4967C29.8903 26.9103 29.8291 27.3317 29.5929 27.7325C29.3567 28.1333 28.9511 28.504 28.4035 28.8195C27.8559 29.1351 27.1792 29.3882 26.419 29.5616C25.6588 29.735 24.833 29.8248 23.9974 29.8248C23.1618 29.8248 22.336 29.735 21.5758 29.5616C20.8156 29.3882 20.1388 29.1351 19.5913 28.8195C19.0437 28.504 18.6381 28.1333 18.4019 27.7325C18.1657 27.3317 18.1045 26.9103 18.2224 26.4967L21.7387 14.0834C21.8676 13.582 22.1596 13.1377 22.5688 12.8205C22.9779 12.5032 23.4809 12.3311 23.9986 12.3311C24.5163 12.3311 25.0193 12.5032 25.4284 12.8205C25.8375 13.1377 26.1295 13.582 26.2584 14.0834L29.7724 26.4967Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20.7266 17.665C21.6924 17.9923 22.8323 18.1672 23.9991 18.1672C25.1658 18.1672 26.3057 17.9923 27.2716 17.665"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBgColor: "bg-[#1C2E4A]",
      onClick: () =>
        router.push("/reports/general-traffic-offence-reports/no-vehicle-involved"), // Adjust route as needed or use query param
    },
    {
      title: "General & Traffic Offence Reports- Vehicle Involved",
      count: counts.trafficVehicle,
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="24" fill="#1C2E4A" />
          <path
            d="M26.332 28.6667H20.4987M32.1654 28.6667H35.6654V24.9917C35.6662 24.714 35.5679 24.4452 35.3883 24.2335C35.2087 24.0218 34.9594 23.8811 34.6854 23.8367L28.6654 22.8333L25.5154 18.6333C25.4067 18.4885 25.2658 18.3708 25.1038 18.2899C24.9418 18.2089 24.7632 18.1667 24.582 18.1667H16.112C15.6772 18.1637 15.2501 18.2822 14.8791 18.509C14.508 18.7357 14.2077 19.0617 14.012 19.45L13.0787 21.3517C12.5889 22.3254 12.3332 23.4 12.332 24.49V28.6667H14.6654"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5846 32.1667C19.1955 32.1667 20.5013 30.8609 20.5013 29.25C20.5013 27.6392 19.1955 26.3334 17.5846 26.3334C15.9738 26.3334 14.668 27.6392 14.668 29.25C14.668 30.8609 15.9738 32.1667 17.5846 32.1667Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29.2487 32.1667C30.8595 32.1667 32.1654 30.8609 32.1654 29.25C32.1654 27.6392 30.8595 26.3334 29.2487 26.3334C27.6379 26.3334 26.332 27.6392 26.332 29.25C26.332 30.8609 27.6379 32.1667 29.2487 32.1667Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBgColor: "bg-[#1C2E4A]",
      onClick: () =>
        router.push("/reports/general-traffic-offence-reports/vehicle-involved"), // Adjust route
    },
    {
      title: "Static Speed Check Reports",
      count: counts.staticSpeed,
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="24" fill="#4B5320" />
          <path
            d="M24 25.5L28.0833 21.4166"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M33.6833 29C34.15 27.8333 34.5 26.4333 34.5 25.0333C34.5 19.4333 29.8333 15 24 15C18.1667 15 13.5 19.4333 13.5 25.0333C13.5 26.4333 13.85 27.8333 14.3167 29"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBgColor: "bg-[#4B5320]",
      onClick: () => router.push("/reports/static-speed-check-reports"),
    },
    {
      title: "MP Occurrence & Investigation Reports",
      count: counts.mpOccurrence,
      icon: (
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="48" height="48" rx="24" fill="#7B1E1E" />
          <path
            d="M27.4987 12.3334H20.4987C19.8544 12.3334 19.332 12.8557 19.332 13.5V15.8334C19.332 16.4777 19.8544 17 20.4987 17H27.4987C28.143 17 28.6654 16.4777 28.6654 15.8334V13.5C28.6654 12.8557 28.143 12.3334 27.4987 12.3334Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M28.668 14.6666H31.0013C31.6201 14.6666 32.2136 14.9125 32.6512 15.35C33.0888 15.7876 33.3346 16.3811 33.3346 17V33.3333C33.3346 33.9521 33.0888 34.5456 32.6512 34.9832C32.2136 35.4208 31.6201 35.6666 31.0013 35.6666H17.0013C16.3825 35.6666 15.789 35.4208 15.3514 34.9832C14.9138 34.5456 14.668 33.9521 14.668 33.3333V17C14.668 16.3811 14.9138 15.7876 15.3514 15.35C15.789 14.9125 16.3825 14.6666 17.0013 14.6666H19.3346"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 22.8334H28.6667"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 28.6666H28.6667"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.332 22.8334H19.3437"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19.332 28.6666H19.3437"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      iconBgColor: "bg-[#7B1E1E]",
      onClick: () => router.push("/reports/mp-occurrence-reports"),
    },
    {
      title: "MT Accident Register: 21 Corps Pro",
      count: counts.mtAccident,
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="48" height="48" rx="24" fill="#C2A14D" />
          <path d="M26.332 28.6641H20.4987M32.1654 28.6641H35.6654V24.9891C35.6662 24.7115 35.5679 24.4427 35.3883 24.2309C35.2087 24.0192 34.9594 23.8785 34.6854 23.8341L28.6654 22.8308L25.5154 18.6308C25.4067 18.4859 25.2658 18.3683 25.1038 18.2873C24.9418 18.2063 24.7632 18.1641 24.582 18.1641H16.112C15.6772 18.1611 15.2501 18.2796 14.8791 18.5064C14.508 18.7332 14.2077 19.0591 14.012 19.4475L13.0787 21.3491C12.5889 22.3228 12.3332 23.3975 12.332 24.4875V28.6641H14.6654" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17.5846 32.1693C19.1955 32.1693 20.5013 30.8634 20.5013 29.2526C20.5013 27.6418 19.1955 26.3359 17.5846 26.3359C15.9738 26.3359 14.668 27.6418 14.668 29.2526C14.668 30.8634 15.9738 32.1693 17.5846 32.1693Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29.2487 32.1693C30.8595 32.1693 32.1654 30.8634 32.1654 29.2526C32.1654 27.6418 30.8595 26.3359 29.2487 26.3359C27.6379 26.3359 26.332 27.6418 26.332 29.2526C26.332 30.8634 27.6379 32.1693 29.2487 32.1693Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

      ),
      iconBgColor: "bg-[#C2A14D]",
      onClick: () => console.log("Navigate to MT Accident"),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <ReportPageHeader
        title="All Registered Reports"
        breadcrumbItems={[{ label: "Reports & Analysis", href: "/" }]}
        reportCount={counts.trafficVehicle + counts.trafficNoVehicle + counts.staticSpeed + counts.mpOccurrence + counts.immediateIncident + counts.mtAccident}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {reportCards.map((card, index) => (
          <ReportsCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
