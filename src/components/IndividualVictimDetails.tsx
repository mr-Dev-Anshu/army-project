import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { SuggestionInput } from "@/common/component/SuggestionInput";

interface IndividualVictimDetailsProps {
    data: any;
    onChange: (path: string, value: any) => void;
}

export const IndividualVictimDetails: React.FC<IndividualVictimDetailsProps> = ({ data, onChange }) => {
    return (
        <section className="space-y-4">
            <div className="space-y-4">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Individual / Victim Details</h3>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Select Individual & Fill Details</p>
                    <RadioGroup
                        value={data.individualType}
                        onValueChange={(v) => onChange("individualType", v)}
                        className="grid grid-cols-2 gap-3"
                    >
                        {[
                            { id: "militaryPersonnel", label: "Military Personnel" },
                            { id: "civilian", label: "Civilian / Dependent" },
                            { id: "employee", label: "Employee" },
                            { id: "servantMaid", label: "Servant / Maid" },
                            { id: "shopKeeper", label: "Shop Keeper" },
                            { id: "tempHiredWorker", label: "Temporary Hired Worker" },
                        ].map((type) => (
                            <label
                                key={type.id}
                                className={cn(
                                    "flex items-center space-x-2 rounded-md border h-10 px-3 cursor-pointer hover:bg-gray-50 transition-colors",
                                    data.individualType === type.id
                                        ? "border-blue-500 bg-gray-50"
                                        : "border-gray-200"
                                )}
                            >
                                <RadioGroupItem value={type.id} id={type.id} />
                                <span className="text-xs font-medium">{type.label}</span>
                            </label>
                        ))}
                    </RadioGroup>
                </div>
            </div>

            {/* Conditional Fields based on Individual Type */}
            {data.individualType === "militaryPersonnel" && (
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Army No."
                                fieldType="armyNo"
                                placeholder="eg. 122334F"
                                value={data.individualDetails?.militaryPersonnelArmyNo || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelArmyNo", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Rank"
                                fieldType="rank"
                                placeholder="eg. Sepoy"
                                value={data.individualDetails?.militaryPersonnelRank || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelRank", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Unit"
                                fieldType="unit"
                                placeholder="eg. "
                                value={data.individualDetails?.militaryPersonnelUnit || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelUnit", v)}
                            />
                        </div>
                        {/* Rest of Military Personnel Fields - keeping structure but ensuring spacing */}
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Name"
                                fieldType="name"
                                placeholder="eg. John Doe"
                                value={data.individualDetails?.militaryPersonnelName || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelName", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="FMN"
                                fieldType="fmn"
                                placeholder="eg."
                                value={data.individualDetails?.militaryPersonnelFmn || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelFmn", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Command"
                                fieldType="command"
                                placeholder="eg."
                                value={data.individualDetails?.militaryPersonnelCommand || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelCommand", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Address"
                                fieldType="address"
                                placeholder="e.g. A-123456"
                                value={data.individualDetails?.militaryPersonnelAddress || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelAddress", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="I Card Number"
                                fieldType="iCardNumber"
                                placeholder="e.g. A-123456"
                                value={data.individualDetails?.militaryPersonnelICardNumber || ""}
                                onChange={(v) => onChange("individualDetails.militaryPersonnelICardNumber", v)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {data.individualType === "employee" && (
                <div className="space-y-4 pt-2">
                    {/* Employee fields block */}
                    <div className="space-y-1">
                        <SuggestionInput
                            label={<span>Service Number <span className="text-red-500">*</span></span>}
                            fieldType="serviceNumber"
                            placeholder="e.g. MES-12345678"
                            value={data.individualDetails?.employeeServiceNumber || ""}
                            onChange={(v) => onChange("individualDetails.employeeServiceNumber", v)}
                        />
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label={"Name"}
                            fieldType="name"
                            placeholder="e.g. John Doe"
                            value={data.individualDetails?.employeeName || ""}
                            onChange={(v) => onChange("individualDetails.employeeName", v)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Rank"
                                fieldType="rank"
                                placeholder="Select rank"
                                value={data.individualDetails?.employeeRank || ""}
                                onChange={(v) => onChange("individualDetails.employeeRank", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Unit"
                                fieldType="unit"
                                placeholder="Select unit"
                                value={data.individualDetails?.employeeUnit || ""}
                                onChange={(v) => onChange("individualDetails.employeeUnit", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="FMN"
                                fieldType="fmn"
                                placeholder="Select FMN"
                                value={data.individualDetails?.employeeFmn || ""}
                                onChange={(v) => onChange("individualDetails.employeeFmn", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Command"
                                fieldType="command"
                                placeholder="Select Command"
                                value={data.individualDetails?.employeeCommand || ""}
                                onChange={(v) => onChange("individualDetails.employeeCommand", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Address"
                                fieldType="address"
                                placeholder="e.g. A-123456"
                                value={data.individualDetails?.employeeAddress || ""}
                                onChange={(v) => onChange("individualDetails.employeeAddress", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="I Card Number"
                                fieldType="iCardNumber"
                                placeholder="e.g. A-123456"
                                value={data.individualDetails?.employeeICardNumber || ""}
                                onChange={(v) => onChange("individualDetails.employeeICardNumber", v)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {data.individualType === "servantMaid" && (
                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <SuggestionInput
                            label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                            fieldType="maidPassNumber"
                            placeholder="e.g. 12345678"
                            value={data.individualDetails?.maidPassNumber || ""}
                            onChange={(v) => onChange("individualDetails.maidPassNumber", v)}
                        />
                    </div>

                    <div className="space-y-1">
                        <SuggestionInput
                            label="Father's Name (Son of)"
                            fieldType="fathersName"
                            placeholder="e.g. Name"
                            value={data.individualDetails?.maidFathersName || ""}
                            onChange={(v) => onChange("individualDetails.maidFathersName", v)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Pass ID"
                                fieldType="passID"
                                placeholder="e.g. 1234"
                                value={data.individualDetails?.maidPassID || ""}
                                onChange={(v) => onChange("individualDetails.maidPassID", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Name"
                                fieldType="name"
                                placeholder="e.g. John Doe"
                                value={data.individualDetails?.maidName || ""}
                                onChange={(v) => onChange("individualDetails.maidName", v)}
                            />
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Trade"
                                fieldType="trade"
                                placeholder="Maid Servant"
                                value={data.individualDetails?.maidTrade || ""}
                                onChange={(v) => onChange("individualDetails.maidTrade", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Worked at Quarter Number"
                                fieldType="quarterNumber"
                                placeholder="e.g. DM-35/4"
                                value={data.individualDetails?.maidQuarterNumber || ""}
                                onChange={(v) => onChange("individualDetails.maidQuarterNumber", v)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <SuggestionInput
                            label="Officers Enclave C/O Rank"
                            fieldType="rank"
                            placeholder="Select Rank"
                            value={data.individualDetails?.officersEnclaveRank || ""}
                            onChange={(v) => onChange("individualDetails.officersEnclaveRank", v)}
                        />
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Name"
                            fieldType="name"
                            placeholder="Name"
                            value={data.individualDetails?.officersEnclaveName || ""}
                            onChange={(v) => onChange("individualDetails.officersEnclaveName", v)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Place of QTR."
                                fieldType="placeOfQtr"
                                placeholder="Enter Location"
                                value={data.individualDetails?.officersEnclavePlaceOfQtr || ""}
                                onChange={(v) => onChange("individualDetails.officersEnclavePlaceOfQtr", v)}
                            />
                        </div>

                        <div className="space-y-1">
                            <SuggestionInput
                                label="Unit"
                                fieldType="unit"
                                placeholder="Select unit"
                                value={data.individualDetails?.officersEnclaveUnit || ""}
                                onChange={(v) => onChange("individualDetails.officersEnclaveUnit", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="FMN"
                                fieldType="fmn"
                                placeholder="Select FMN"
                                value={data.individualDetails?.officersEnclaveFmn || ""}
                                onChange={(v) => onChange("individualDetails.officersEnclaveFmn", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Command"
                                fieldType="command"
                                placeholder="Select Command"
                                value={data.individualDetails?.officersEnclaveCommand || ""}
                                onChange={(v) => onChange("individualDetails.officersEnclaveCommand", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Address"
                                fieldType="address"
                                placeholder="e.g. A-123456"
                                value={data.individualDetails?.officersEnclaveAddress || ""}
                                onChange={(v) => onChange("individualDetails.officersEnclaveAddress", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="I Card Number"
                                fieldType="iCardNumber"
                                placeholder="e.g. A-123456"
                                value={data.individualDetails?.officersEnclaveICardNumber || ""}
                                onChange={(v) => onChange("individualDetails.officersEnclaveICardNumber", v)}
                            />
                        </div>
                    </div>
                </div>

            )}

            {data.individualType === "shopKeeper" && (
                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Shop Owner Name"
                            fieldType="name"
                            placeholder="Enter Shop Owner Name"
                            value={data.individualDetails?.shopOwnerName || ""}
                            onChange={(v) => onChange("individualDetails.shopOwnerName", v)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Shop Address"
                                fieldType="address"
                                placeholder="e.g. C/O 56 APO"
                                value={data.individualDetails?.shopAddress || ""}
                                onChange={(v) => onChange("individualDetails.shopAddress", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Shop Name"
                                fieldType="shopName"
                                placeholder="Shop Name"
                                value={data.individualDetails?.shopName || ""}
                                onChange={(v) => onChange("individualDetails.shopName", v)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Unit"
                            fieldType="unit"
                            placeholder="Select unit"
                            value={data.individualDetails?.shopUnit || ""}
                            onChange={(v) => onChange("individualDetails.shopUnit", v)}
                        />
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Pass No."
                            fieldType="passNumber"
                            placeholder="Enter Pass No."
                            value={data.individualDetails?.shopPassNo || ""}
                            onChange={(v) => onChange("individualDetails.shopPassNo", v)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Pass Issue Date</Label>
                            <Input
                                type="date"
                                value={data.individualDetails?.shopPassIssueDate ? new Date(data.individualDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => e.target.value && onChange("individualDetails.shopPassIssueDate", new Date(e.target.value).toISOString())}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Pass Expire Date</Label>
                            <Input
                                type="date"
                                value={data.individualDetails?.shopPassExpireDate ? new Date(data.individualDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => e.target.value && onChange("individualDetails.shopPassExpireDate", new Date(e.target.value).toISOString())}
                            />
                        </div>
                    </div>
                </div>
            )}

            {data.individualType === "tempHiredWorker" && (
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Name"
                                fieldType="name"
                                placeholder="e.g. John Doe"
                                value={data.individualDetails?.tempWorkerName || ""}
                                onChange={(v) => onChange("individualDetails.tempWorkerName", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Place of Stay"
                                fieldType="address"
                                placeholder="e.g. C/O 56 APO"
                                value={data.individualDetails?.tempWorkerPlaceOfStay || ""}
                                onChange={(v) => onChange("individualDetails.tempWorkerPlaceOfStay", v)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Place Of Work"
                                fieldType="address"
                                placeholder="e.g. C/O 56 APO"
                                value={data.individualDetails?.tempWorkerPlaceOfWork || ""}
                                onChange={(v) => onChange("individualDetails.tempWorkerPlaceOfWork", v)}
                            />
                        </div>
                        <div className="space-y-1">
                            <SuggestionInput
                                label="Type of Work"
                                fieldType="trade"
                                placeholder="e.g. John Shop"
                                value={data.individualDetails?.tempWorkerTypeOfWork || ""}
                                onChange={(v) => onChange("individualDetails.tempWorkerTypeOfWork", v)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Pass No."
                            fieldType="passNumber"
                            value={data.individualDetails?.tempWorkerPassNo || ""}
                            onChange={(v) => onChange("individualDetails.tempWorkerPassNo", v)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Pass Issue Date</Label>
                            <Input
                                type="date"
                                value={data.individualDetails?.tempWorkerPassIssueDate ? new Date(data.individualDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => e.target.value && onChange("individualDetails.tempWorkerPassIssueDate", new Date(e.target.value).toISOString())}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Pass Expire Date</Label>
                            <Input
                                type="date"
                                value={data.individualDetails?.tempWorkerPassExpireDate ? new Date(data.individualDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                onChange={(e) => e.target.value && onChange("individualDetails.tempWorkerPassExpireDate", new Date(e.target.value).toISOString())}
                            />
                        </div>
                    </div>
                </div>
            )}

            {data.individualType === "civilian" && (
                <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Name"
                            fieldType="name"
                            placeholder="e.g. John Doe"
                            value={data.individualDetails?.civilianName || ""}
                            onChange={(v) => onChange("individualDetails.civilianName", v)}
                        />
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Aadhar Card Number"
                            fieldType="aadharCardNumber"
                            placeholder="e.g. 8888 8888 8888"
                            value={data.individualDetails?.civilianAadharCardNumber || ""}
                            onChange={(v) => onChange("individualDetails.civilianAadharCardNumber", v)}
                        />
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Father's / Husband's Name"
                            fieldType="fathersName"
                            placeholder="e.g. Naman"
                            value={data.individualDetails?.civilianFathersName || ""}
                            onChange={(v) => onChange("individualDetails.civilianFathersName", v)}
                        />
                    </div>
                    <div className="space-y-1">
                        <SuggestionInput
                            label="Address"
                            fieldType="address"
                            placeholder="e.g. 123 Main St"
                            value={data.individualDetails?.civilianAddress || ""}
                            onChange={(v) => onChange("individualDetails.civilianAddress", v)}
                        />
                    </div>

                    <div className="flex items-center space-x-2 py-2">
                        <Checkbox
                            id="isDependent"
                            checked={data.individualDetails?.isDependent || false}
                            onCheckedChange={(checked) => onChange("individualDetails.isDependent", checked)}
                        />
                        <label
                            htmlFor="isDependent"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Is this person <span className="font-bold">Dependent / Relative</span> of Military Personnel or Other Registered?
                        </label>
                    </div>

                    {data.individualDetails?.isDependent && (
                        <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                            <div className="space-y-1">
                                <SuggestionInput
                                    label="Name the relation"
                                    fieldType="relationName"
                                    placeholder="e.g. Brother-in-law"
                                    value={data.individualDetails?.relationName || ""}
                                    onChange={(v) => onChange("individualDetails.relationName", v)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Who is it?</Label>
                                <RadioGroup
                                    value={data.individualDetails?.relativeCategory || ""}
                                    onValueChange={(v) => onChange("individualDetails.relativeCategory", v)}
                                    className="grid grid-cols-2 gap-3"
                                >
                                    {[
                                        { id: "militaryPersonnel", label: "Military Personnel" },
                                        { id: "servantMaid", label: "Servant / Maid" },
                                        { id: "shopKeeper", label: "Shop Keeper" },
                                        { id: "tempHiredWorker", label: "Temporary Hired Worker" },
                                        { id: "employee", label: "Employee" },
                                    ].map((type) => (
                                        <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-md p-2" key={type.id}>
                                            <RadioGroupItem value={type.id} id={`rel-${type.id}`} />
                                            <Label htmlFor={`rel-${type.id}`} className="font-normal cursor-pointer">{type.label}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Nested Relative Details */}
                            {data.individualDetails?.relativeCategory === "militaryPersonnel" && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700">Relative (Military Personnel) Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Army No."
                                                fieldType="armyNo"
                                                placeholder="eg. 122334F"
                                                value={data.individualDetails?.relativeDetails?.armyNo || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.armyNo", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Name"
                                                fieldType="name"
                                                placeholder="eg. John Doe"
                                                value={data.individualDetails?.relativeDetails?.militaryPersonnelName || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.militaryPersonnelName", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">

                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Rank"
                                                fieldType="rank"
                                                placeholder="eg. Sepoy"
                                                value={data.individualDetails?.relativeDetails?.rank || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.rank", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Unit"
                                                fieldType="unit"
                                                placeholder="eg."
                                                value={data.individualDetails?.relativeDetails?.militaryPersonnelUnit || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.militaryPersonnelUnit", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="FMN"
                                                fieldType="fmn"
                                                placeholder="eg."
                                                value={data.individualDetails?.relativeDetails?.militaryPersonnelFmn || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.militaryPersonnelFmn", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Command"
                                                fieldType="command"
                                                placeholder="eg."
                                                value={data.individualDetails?.relativeDetails?.militaryPersonnelCommand || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.militaryPersonnelCommand", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Address"
                                                fieldType="address"
                                                placeholder="e.g. CO 21-123456"
                                                value={data.individualDetails?.relativeDetails?.militaryPersonnelAddress || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.militaryPersonnelAddress", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="I Card Number"
                                                fieldType="iCardNumber"
                                                placeholder="e.g. A-123456"
                                                value={data.individualDetails?.relativeDetails?.militaryPersonnelICardNumber || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.militaryPersonnelICardNumber", v)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.individualDetails?.relativeCategory === "employee" && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700">Relative (Employee) Details</h4>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label={<span>Service Number <span className="text-red-500">*</span></span>}
                                            fieldType="serviceNumber"
                                            placeholder="e.g. MES-12345678"
                                            value={data.individualDetails?.relativeDetails?.employeeServiceNumber || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.employeeServiceNumber", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label={"Name"}
                                            fieldType="name"
                                            placeholder="e.g. John Doe"
                                            value={data.individualDetails?.relativeDetails?.employeeName || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.employeeName", v)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Rank"
                                                fieldType="rank"
                                                placeholder="Select rank"
                                                value={data.individualDetails?.relativeDetails?.employeeRank || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.employeeRank", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Unit"
                                                fieldType="unit"
                                                placeholder="Select unit"
                                                value={data.individualDetails?.relativeDetails?.employeeUnit || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.employeeUnit", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="FMN"
                                                fieldType="fmn"
                                                placeholder="Select FMN"
                                                value={data.individualDetails?.relativeDetails?.employeeFmn || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.employeeFmn", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Command"
                                                fieldType="command"
                                                placeholder="Select Command"
                                                value={data.individualDetails?.relativeDetails?.employeeCommand || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.employeeCommand", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Address"
                                                fieldType="address"
                                                placeholder="e.g. A-123456"
                                                value={data.individualDetails?.relativeDetails?.employeeAddress || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.employeeAddress", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="I Card Number"
                                                fieldType="iCardNumber"
                                                placeholder="e.g. A-123456"
                                                value={data.individualDetails?.employeeICardNumber || ""}
                                                onChange={(v) => onChange("individualDetails.employeeICardNumber", v)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.individualDetails?.relativeCategory === "servantMaid" && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700">Relative (Servant / Maid) Details</h4>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label={<span>Maid/Servant Pass Number <span className="text-red-500">*</span></span>}
                                            fieldType="maidPassNumber"
                                            placeholder="e.g. 12345678"
                                            value={data.individualDetails?.relativeDetails?.maidPassNumber || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.maidPassNumber", v)}
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Father's Name (Son of)"
                                            fieldType="fathersName"
                                            placeholder="e.g. Name"
                                            value={data.individualDetails?.relativeDetails?.maidFathersName || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.maidFathersName", v)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Pass ID"
                                                fieldType="passID"
                                                placeholder="e.g. 1234"
                                                value={data.individualDetails?.relativeDetails?.maidPassID || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.maidPassID", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Name"
                                                fieldType="name"
                                                placeholder="e.g. John Doe"
                                                value={data.individualDetails?.relativeDetails?.maidName || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.maidName", v)}
                                            />
                                        </div>
                                    </div>


                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Trade"
                                                fieldType="trade"
                                                placeholder="Maid Servant"
                                                value={data.individualDetails?.relativeDetails?.maidTrade || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.maidTrade", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Worked at Quarter Number"
                                                fieldType="quarterNumber"
                                                placeholder="e.g. DM-35/4"
                                                value={data.individualDetails?.relativeDetails?.maidQuarterNumber || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.maidQuarterNumber", v)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Officers Enclave C/O Rank"
                                            fieldType="rank"
                                            placeholder="Select Rank"
                                            value={data.individualDetails?.relativeDetails?.officersEnclaveRank || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclaveRank", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Name"
                                            fieldType="name"
                                            placeholder="Name"
                                            value={data.individualDetails?.relativeDetails?.officersEnclaveName || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclaveName", v)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Place of QTR."
                                                fieldType="placeOfQtr"
                                                placeholder="Enter Location"
                                                value={data.individualDetails?.relativeDetails?.officersEnclavePlaceOfQtr || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclavePlaceOfQtr", v)}
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Unit"
                                                fieldType="unit"
                                                placeholder="Select unit"
                                                value={data.individualDetails?.relativeDetails?.officersEnclaveUnit || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclaveUnit", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="FMN"
                                                fieldType="fmn"
                                                placeholder="Select FMN"
                                                value={data.individualDetails?.relativeDetails?.officersEnclaveFmn || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclaveFmn", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Command"
                                                fieldType="command"
                                                placeholder="Select Command"
                                                value={data.individualDetails?.relativeDetails?.officersEnclaveCommand || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclaveCommand", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Address"
                                                fieldType="address"
                                                placeholder="e.g. A-123456"
                                                value={data.individualDetails?.relativeDetails?.officersEnclaveAddress || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclaveAddress", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="I Card Number"
                                                fieldType="iCardNumber"
                                                placeholder="e.g. A-123456"
                                                value={data.individualDetails?.relativeDetails?.officersEnclaveICardNumber || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.officersEnclaveICardNumber", v)}
                                            />
                                        </div>
                                    </div>
                                </div>

                            )}

                            {data.individualDetails?.relativeCategory === "shopKeeper" && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700">Relative (Shop Keeper) Details</h4>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Shop Owner Name"
                                            fieldType="name"
                                            placeholder="Enter Shop Owner Name"
                                            value={data.individualDetails?.relativeDetails?.shopOwnerName || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.shopOwnerName", v)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Shop Address"
                                                fieldType="address"
                                                placeholder="e.g. C/O 56 APO"
                                                value={data.individualDetails?.relativeDetails?.shopAddress || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.shopAddress", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Shop Name"
                                                fieldType="shopName"
                                                placeholder="Shop Name"
                                                value={data.individualDetails?.relativeDetails?.shopName || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.shopName", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Unit"
                                            fieldType="unit"
                                            placeholder="Select unit"
                                            value={data.individualDetails?.relativeDetails?.shopUnit || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.shopUnit", v)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Pass No."
                                            fieldType="passNumber"
                                            placeholder="Enter Pass No."
                                            value={data.individualDetails?.relativeDetails?.shopPassNo || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.shopPassNo", v)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Pass Issue Date</Label>
                                            <Input
                                                type="date"
                                                value={data.individualDetails?.relativeDetails?.shopPassIssueDate ? new Date(data.individualDetails.relativeDetails.shopPassIssueDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => e.target.value && onChange("individualDetails.relativeDetails.shopPassIssueDate", new Date(e.target.value).toISOString())}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Pass Expire Date</Label>
                                            <Input
                                                type="date"
                                                value={data.individualDetails?.relativeDetails?.shopPassExpireDate ? new Date(data.individualDetails.relativeDetails.shopPassExpireDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => e.target.value && onChange("individualDetails.relativeDetails.shopPassExpireDate", new Date(e.target.value).toISOString())}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {data.individualDetails?.relativeCategory === "tempHiredWorker" && (
                                <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-700">Relative (Temporary Hired Worker) Details</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Name"
                                                fieldType="name"
                                                placeholder="e.g. John Doe"
                                                value={data.individualDetails?.relativeDetails?.tempWorkerName || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.tempWorkerName", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Place of Stay"
                                                fieldType="address"
                                                placeholder="e.g. C/O 56 APO"
                                                value={data.individualDetails?.relativeDetails?.tempWorkerPlaceOfStay || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.tempWorkerPlaceOfStay", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Place Of Work"
                                                fieldType="address"
                                                placeholder="e.g. C/O 56 APO"
                                                value={data.individualDetails?.relativeDetails?.tempWorkerPlaceOfWork || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.tempWorkerPlaceOfWork", v)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <SuggestionInput
                                                label="Type of Work"
                                                fieldType="trade"
                                                placeholder="e.g. John Shop"
                                                value={data.individualDetails?.relativeDetails?.tempWorkerTypeOfWork || ""}
                                                onChange={(v) => onChange("individualDetails.relativeDetails.tempWorkerTypeOfWork", v)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <SuggestionInput
                                            label="Pass No."
                                            fieldType="passNumber"
                                            value={data.individualDetails?.relativeDetails?.tempWorkerPassNo || ""}
                                            onChange={(v) => onChange("individualDetails.relativeDetails.tempWorkerPassNo", v)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label>Pass Issue Date</Label>
                                            <Input
                                                type="date"
                                                value={data.individualDetails?.relativeDetails?.tempWorkerPassIssueDate ? new Date(data.individualDetails.relativeDetails.tempWorkerPassIssueDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => e.target.value && onChange("individualDetails.relativeDetails.tempWorkerPassIssueDate", new Date(e.target.value).toISOString())}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Pass Expire Date</Label>
                                            <Input
                                                type="date"
                                                value={data.individualDetails?.relativeDetails?.tempWorkerPassExpireDate ? new Date(data.individualDetails.relativeDetails.tempWorkerPassExpireDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => e.target.value && onChange("individualDetails.relativeDetails.tempWorkerPassExpireDate", new Date(e.target.value).toISOString())}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};
