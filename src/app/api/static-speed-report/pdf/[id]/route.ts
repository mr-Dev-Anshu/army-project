import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;

    if (!id) {
        return new NextResponse('Report ID is required', { status: 400 });
    }

    // Determine the base URL dynamically
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    const reportUrl = `${baseUrl}/print/static-speed-report/${id}`;

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Navigate to the print page
        // Relaxed wait condition to avoid timeouts on long-running background requests
        const response = await page.goto(reportUrl, { waitUntil: 'load', timeout: 60000 });

        if (!response || !response.ok()) {
            throw new Error(`Print page returned status: ${response?.status()} ${response?.statusText()}`);
        }

        // Ensure the report content is loaded
        const reportSelector = '.print\\:block'; // Targeting the main report container
        await page.waitForSelector(reportSelector, { timeout: 20000 });

        // Generate PDF
        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="StaticSpeedReport-${id}.pdf"`,
            },
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        if (browser) await browser.close();

        // Return JSON with error details if possible, or plain text
        return new NextResponse(
            JSON.stringify({ error: `Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}` }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
