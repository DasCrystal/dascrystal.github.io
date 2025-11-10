
let yeeyoo = "https://beautiful-cors.chillcrystal.workers.dev";

async function get99SiteNewsWithPage(pageNumber)
{
    return await fetch(`${yeeyoo}/?url=https://health99.hpa.gov.tw/news?page=${pageNumber}`)
    .then
    (
        resp =>
        {
            return resp.text();
        }
    )
    .then
    (
        resp =>
        {
            return new DOMParser().parseFromString(resp, "text/html");
        }
    )
    .then
    (
        resp =>
        {
            let remoteNews;

            if (resp !== undefined)
            {
                remoteNews = resp.querySelector("#list-table div table tbody");

                // // remove header
                // remoteNews.querySelectorAll("tr")[0].outerHTML = "";
                
                remoteNews.querySelectorAll("tr *[aria-label=\"標題\"] h4").forEach
                (
                    (element) =>
                    {
                        element.innerHTML =  element.innerHTML
                        .replaceAll(" ", "\n")
                        .replaceAll("　", "\n");
                    }
                )
            }
            else
            {
                remoteNews = "<p>無法取得遠端網頁</p>";
            }

            return remoteNews;
        }
    )
}

window.addEventListener
(
    "DOMContentLoaded",
    async (event) =>
    {
        document.querySelector("#newsinjectpoint").innerHTML += (await get99SiteNewsWithPage(1)).innerHTML;
        document.querySelector("#newsinjectpoint").innerHTML += "<hr>";
        document.querySelector("#newsinjectpoint").innerHTML += (await get99SiteNewsWithPage(2)).innerHTML;
        // document.querySelector("#newsinjectpoint").innerHTML += "<hr>";
        // document.querySelector("#newsinjectpoint").innerHTML += (await get99SiteNewsWithPage(3)).innerHTML;
    }
)