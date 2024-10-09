import puppeteer from "puppeteer";
import express from "express";

const router = express.Router();




router.get('/:slug', async (req, res) => {
    const data = req.params.slug.toLowerCase().replace(" ", "%20")
    let browser;
    try {
        browser = await puppeteer.launch();

        const page = await browser.newPage();


        const medpage = "https://www.1mg.com/search/all?filter=true&name=" + data;

        await page.goto(medpage);

        await page.waitForSelector('#category-container > div > div.col-xs-12.col-md-10.col-sm-9 > div:nth-child(2) > div > div > div > div.row.style__grid-container___3OfcL')

        const cardsData = await page.evaluate(async () => {

            const response = document.querySelector("#category-container > div > div.col-xs-12.col-md-10.col-sm-9 > div:nth-child(2) > div > div > div > div.row.style__grid-container___3OfcL> div > div:nth-child(1)");

            const name = response.querySelector('div > a > div.style__product-description___zY35s > div.style__pro-title___3G3rr').innerText
            const price = response.querySelector('div > a > div.style__product-pricing___1OxnE > div > div.style__price-tag___KzOkY').innerText
            const link = response.querySelector('div > a').href
            res_data = { vendor: "1mg", name, price, link }

            return res_data;
        });

        res.status(200).json(cardsData);




    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
    }
    finally {
        browser?.close();
    }
});

export default router;