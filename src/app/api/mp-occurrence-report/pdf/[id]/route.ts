import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const { id } = params;

    if (!id) {
        return new NextResponse(
            JSON.stringify({ error: 'Report ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Determine the base URL dynamically
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    const reportUrl = `${baseUrl}/print/mp-occurrence-report/${id}`;

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ],
        });

        const page = await browser.newPage();

        // Fast wait condition: proceed as soon as DOM is ready. 
        // We wait for the selector explicitly anyway.
        await page.goto(reportUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Ensure the report content is loaded
        const reportSelector = '.print\\:block';
        await page.waitForSelector(reportSelector, { timeout: 30000 });

        // Generate PDF
        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdf), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="MPOccurrenceReport-${id}.pdf"`,
            },
        });

    } catch (error) {
        console.error('PDF Generation Error:', error);
        if (browser) await browser.close();
        return new NextResponse(
            JSON.stringify({ error: `Error generating PDF: ${error instanceof Error ? error.message : 'Unknown error'}` }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
