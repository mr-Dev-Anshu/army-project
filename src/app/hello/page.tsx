"use client";

import React, { useState } from "react";
import OffencesSection from "@/features/offence-references/components/OffenceSection";

const Page: React.FC = () => {
  const [selectedOffences, setSelectedOffences] = useState<string[]>([]);
  const [selectedReferences, setSelectedReferences] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <OffencesSection
        selectedOffences={selectedOffences}
        setSelectedOffences={setSelectedOffences}
        selectedReferences={selectedReferences}
        setSelectedReferences={setSelectedReferences}
      />

      <div className="mt-10 max-w-4xl mx-auto p-4 bg-gray-100 rounded">
        <pre className="text-sm">
          Selected Offences: {JSON.stringify(selectedOffences, null, 2)}
          <br />
          Selected References (all): {JSON.stringify(selectedReferences, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Page;