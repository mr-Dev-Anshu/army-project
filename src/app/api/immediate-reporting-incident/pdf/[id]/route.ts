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

        // Forward cookies to maintain authentication
        const cookies = req.cookies.getAll();
        const urlObj = new URL(req.nextUrl.origin || "http://localhost:3000");

        if (cookies.length > 0) {
            await page.setCookie(...cookies.map(cookie => ({
                name: cookie.name,
                value: cookie.value,
                domain: urlObj.hostname,
                path: '/',
            })));
        }

        const baseUrl = urlObj.origin;
        const targetUrl = `${baseUrl}/print/immediate-reporting-incident/${id}`;

        console.log(`Generating PDF from: ${targetUrl}`);

        await page.goto(targetUrl, {
            waitUntil: "networkidle0",
            timeout: 60000,
        });

        // Wait for the report content to be available
        const element = await page.$("#report-content");
        if (!element) {
            throw new Error("Report element (#report-content) not found on the page.");
        }

        // Give the page a moment to render Tailwind classes
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            margin: {
                top: "10mm",
                bottom: "10mm",
                left: "10mm",
                right: "10mm",
            }
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdf), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=Incident_Report_${id}.pdf`,
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
