
function enableElement(element)
{setDisplay(element, true);}

function disableElement(element)
{setDisplay(element, false);}

function setDisplay(element, tf)
{
    if (tf)
    {element.style.cssText = element.style.cssText.replace("display: none;", "");}
    else
    {element.style.cssText += "display: none;";}
}

function isDisplayed(element)
{return !element.style.cssText.includes("display: none;");}