
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

// /* Auto Content Line Cutting */

// function arrayToLines(array, widthpx, fontpx)
// {
//     charPerLine = widthpx / fontpx - 1;

//     result   = "<div>";
//     readyCut = false;
//     buffer   = "";

//     array.forEach
//     (
//         element =>
//         {
//             if (readyCut)
//             {
//                 if ("，、。".includes(element))
//                 {
//                     result += buffer + element + "</div>";
//                     buffer = "";
//                 }
//                 else
//                 {
//                     result += buffer + "</div><div>";
//                     buffer = element;
//                 }
                
//                 readyCut = false;
//             }
//             else
//             {
//                 buffer += element;

//                 if (charPerLine - buffer.length < charPerLine / 3 && "，、。".includes(element))
//                 {readyCut = true;}
//             }
//         }
//     );
    
//     if (!result.endsWith("</div>"))
//     {result += "</div>";}

//     return result;
// }

// function cutParagraphs()
// {
//     qa("p").forEach
//     (
//         (el) =>
//         {
//             call_jieba_cut
//             (
//                 el.innerHTML,
//                 result =>
//                 {el.innerHTML = arrayToLines(result, el.width, el.style.fontSize);}
//             );
//         }
//     )
// }

/* main() */

window.addEventListener
(
    "DOMContentLoaded",
    () =>
    {
        determineNavbar();
        // cutParagraphs();
    }
)

