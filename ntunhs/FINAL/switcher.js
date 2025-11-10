
window.addEventListener
(
    "click",

    (event) =>
    {
        let classes = event.target.className;
        let last    = document.querySelector(".currentSwitcher");
        let switcher = event.target.textContent;

        if (classes.includes("switcher"))
        {
            document.querySelectorAll("article").forEach
            (
                (element) =>
                {
                    if (element.id === switcher)
                    {
                        enableElement(element);
                        element.scrollIntoView();

                        if (last !== null)
                        {last.className = last.className.replace("currentSwitcher", "").replace("  ", "");}
                        
                        event.target.className += " currentSwitcher ";

                        document.querySelectorAll(`[bindSwitcher=${switcher}]`).forEach
                        (
                            (binded) =>
                            {enableElement(binded);}
                        )
                    }
                    else
                    {
                        disableElement(element);
                        document.querySelectorAll(`[bindSwitcher=${element.id}]`).forEach
                        (
                            (binded) =>
                            {disableElement(binded);}
                        )
                    }
                }
            )
        }
    }
);

window.addEventListener
(
    "DOMContentLoaded",
    (event) =>
    {
        document.querySelectorAll(".switcher")[0].click();
    }
)