
function $(selecting)
{document.querySelector(selecting);}

function $$(selectings)
{document.querySelectorAll(selectings);}

function FR(content)
{
    content.FrBinded = [];

    return new Proxy(
        content, 
        {
            set(target, prop, value, reciever)
            {
                if (target[prop] !== value)
                {
                    for (let binded in target.binded)
                    {binded.textContent = value;}
                }
                return Reflect.set(...arguments);
            }
        }
    );
}

document.body.querySelectorAll("*").forEach(
    (element) => {
        for (let x = 0; x < element.textContent.length; x += 1)
        {
            let current = element.textContent[x];

            switch (current)
            {
                
            }
        }
        
    }
)

// framework will parse text contents, and find all strings that surrended with {},
// Then replace {} with special tag, in order to locate special content.
// Finally, the element will be put into target.FrBinded, when value got set,
// the content will update.

// short marking syntax / SMS:
// {} = an empty element, {(<Attribute>) <textContent>}
// Elements in <Attribute>: #<id>, <class>, <attr>=<val>, !<attrWithoutValue>
// 
