import puppeteer from "puppeteer";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();

        // Get the base URL from the request to ensure we hit the correct internal address
        // Fallback to localhost:3000 if origin is missing (unlikely in Next.js)
        const baseUrl = req.nextUrl.origin || "http://localhost:3000";
        const targetUrl = `${baseUrl}/print/military-police-report/${id}`;

        console.log(`Generating PDF from: ${targetUrl}`);

        await page.goto(targetUrl, {
            waitUntil: "networkidle0",
            timeout: 60000,
        });

        const element = await page.$("#mp-report");
        if (!element) {
            throw new Error("Report element (#mp-report) not found on the page.");
        }

        const box = await element.boundingBox();
        if (!box) {
            throw new Error("Could not compute bounding box for report element.");
        }

        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=MP_Report_${id}.pdf`,
            },
        });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF", details: (error as Error).message },
            { status: 500 }
        );
    }
}
