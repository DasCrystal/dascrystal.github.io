
window.addEventListener
(
    "click",

    (event) =>
    {
        let href = event.target.getAttribute("href");
        if (href != null && href.startsWith("#"))
        {
            let target = document.querySelector(href);

            if (target !== null)
            {
                event.preventDefault();
                target.scrollIntoView();
                window.scrollBy({top: window.visualViewport.height * -0.1, behavior: "smooth"});
            }            
        }
    }
)