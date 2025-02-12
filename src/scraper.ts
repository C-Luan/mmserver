import puppeteer from "puppeteer";

const URL = "https://www.tse.jus.br/servicos-eleitorais/autoatendimento-eleitoral#/atendimento-eleitor";

export async function consultarSituacaoEleitoral(titulo: string) {
    const browser = await puppeteer.launch({ headless: true,slowMo:100 });
    const page = await browser.newPage();

    try {
        await page.goto(URL, { waitUntil: "networkidle0" });
        // Espera o botão de consulta carregar e clica nele
        await page.waitForSelector('app-menu-option[link="atendimento-eleitor/consultar-situacao-titulo-eleitor"]');
        await page.click('app-menu-option[link="atendimento-eleitor/consultar-situacao-titulo-eleitor"]');

        await page.waitForSelector('#titulo-cpf-nome', { timeout: 60000 });
        await page.type('#titulo-cpf-nome', titulo);
        
        // Clica no botão de consulta
     await page.waitForSelector('button.btn-tse', { visible: true, timeout: 60000 });
await page.click('button.btn-tse')

        // Espera o resultado carregar
        await page.waitForSelector('.box', { visible: true, timeout: 60000 });


        // Captura o texto do resultado
        const situacaoTitulo = await page.evaluate(() => {
            const el = document.querySelector('.box p span');
            if (el instanceof HTMLElement) { // Verifique se é um HTMLElement
                return el.innerText; // Agora podemos acessar innerText sem problemas
            }
            return 'Status não encontrado';
        });
        
        
        console.log(`Situação do título: ${situacaoTitulo}`);
        

        await browser.close();
        return situacaoTitulo || "Não foi possível obter a situação.";
    } catch (error) {
        console.error("Erro ao consultar a situação eleitoral:", error);
        await browser.close();
        return "Erro ao consultar.";
    }
}

// Teste manual
// consultarSituacaoEleitoral("02111634220").then(console.log);
