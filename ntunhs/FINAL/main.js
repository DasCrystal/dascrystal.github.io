
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
    "DOMContentLoaded",
    () =>
    {determineNavbar();}
)

window.addEventListener
(
    'scroll',
    () =>
    {determineNavbar();}
);