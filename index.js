import express from 'express'
import puppeteer from 'puppeteer'
import {Database} from 'sqlite-async'

const app = express()
const port = 3000

const db = await Database.open('recipes.db')

app.post('/ajoute-recette',async (req, res) => {
    const getRecette = async ()=>{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.marmiton.org/')
        const selector = '.MRTN__sc-gkm9mr-1.hyghlZ > .SHRD__sc-z48gov-0.dLDbdB.MRTN__sc-gkm9mr-3.jXEnlf'
        console.log(await getContent(selector,page))
        const test= await Promise.all([
            page.click(selector),
            page.waitForNavigation(),
        ]);
        console.log(page.url())
        await page.goto(page.url())

        const title = await getContent('.itJBWW',page)
        let time = await getContent('.bzAHrL',page)
        time = parseInt(time[0].match(/[0-9]+/g)[0])
        await browser.close();
        return{
            title,time
        }
    }

    const newRecipe = await getRecette()
    console.log('insertion des données en cours')
    await db.run('INSERT INTO recipe(title,time) VALUES (?,?)',[newRecipe.title,newRecipe.time])
    console.log('Insertion terminer')
    res.send('Ajoute Recette');
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
async function  getContent(selector,page){
    const pageRes = await page.$$(selector);
    return await Promise.all(
        pageRes.map(async (element) => {
            return await page.evaluate(
                (el) => el.textContent,
                element
            );
        })
    );
}