import { connectDB } from "@/lib/db/mongodb";
import { divisionAnalysisService } from "@/services/divisionAnalysis";
import { NextResponse } from "next/server";


export  async function GET (){
    try {
        await connectDB();
        const analysisData =  await divisionAnalysisService.getAllDivisionAnalysis() ; 
         console.log(analysisData)
         return NextResponse.json(analysisData)
    } catch (error) {
         return NextResponse.error(error)
    }
}