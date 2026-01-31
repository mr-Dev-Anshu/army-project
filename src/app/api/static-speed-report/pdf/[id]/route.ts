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

        // Wait for page to fully load with network idle
        await page.goto(reportUrl, { waitUntil: 'networkidle0', timeout: 60000 });

        // Wait for the report body to be present
        await page.waitForSelector('body', { timeout: 30000 });

        // Give the page a moment to render Tailwind classes
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 1000)));

        // Generate PDF
        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4',
            margin: {
                top: '0.5cm',
                right: '0.5cm',
                bottom: '0.5cm',
                left: '0.5cm'
            }
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
