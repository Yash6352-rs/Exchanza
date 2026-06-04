const express = require("express");

const puppeteer = require("puppeteer");

const {
    generateAnalyticsTemplate,
} = require("../templates/analyticsTemplate");

const router = express.Router();

router.post("/analytics", async (req, res) => {
    
    console.log("PDF Request Rececived");
    try {
        

        const html = generateAnalyticsTemplate(req.body);

        let browser;

        browser = await puppeteer.launch({
            headless: true,
            timeout: 0,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ]
        });

        const page = await browser.newPage();
        console.log("HTML GENERATED");

        await page.setContent(html, {
            waitUntil: "domcontentloaded",
            timeout: 0,
        });

        await new Promise(resolve => 
            setTimeout(resolve, 3000)
        );

        await page.evaluateHandle('document.fonts.ready');
        await page.emulateMediaType("screen");

        const pdf = await page.pdf({

            format: "A4",
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            scale: 1,
            margin: {
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px",
            },
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Length": pdf.length,
        });
        console.log("PDF GENERATED");

        res.send(pdf);

    } catch (error) {
        console.error("PDF ERROR: ", error)
        res.status(500).send("PDF Error");

        if (browser) {
            await browser.close();
        }
    }
});

module.exports = router;