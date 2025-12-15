
/* Smart Navbar */

// https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport
function isElementInViewport(el)
{

    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}

function determineNavbar()
{
    if (!isElementInViewport(q(".jumper")))
    {q("nav").style.display = "flex";}
    else
    {q("nav").style.display = "none";}
}

window.addEventListener
(
    'scroll',
    () =>
    {determineNavbar();}
);

/* Auto Content Line Cutting */
// CSS define of element "pl" was required.

function cutParagraphs()
{
    qa(".content").forEach
    (
        (e) =>
        {
            e.innerHTML = cutParagraph(e.innerHTML);
        }
    )
}

function cutParagraph(content)
{
    result = "<pl>" + content.replaceAll("。", "。</pl><pl>");
    
    if (result.endsWith("<pl>"))
    {result = result.slice(0, -4);}
    else
    {result = result + "</pl>";}

    console.log(result);
    
    return result;
}

/* main() */

window.addEventListener
(
    "DOMContentLoaded",
    () =>
    {
        determineNavbar();
        cutParagraphs();
    }
)

