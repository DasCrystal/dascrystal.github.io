
{
    const ATTR_PREFIX = 'att';

    async function doIt()
    {
        for (let template of document.head.querySelectorAll('template[import]')) {
            let url = template.getAttribute('import');
            await fetch(url).then((resp) => resp.text()).then((content) => template.outerHTML = content);
        }

        // Code for Template
        
        const globalStyle = document.createElement('style');
        document.head.append(globalStyle);

        for (let template of document.head.getElementsByTagName('template'))
        {
            let tName;
            let tVars = {};
            let tEvents = {};
            let tTimers = {
                '10': [],
                '1': [],
                '05': [],
                '01': [],
                '005': [],
                '001': [],

            };
            for (let attr of template.getAttributeNames()) {
                const realName = attr.substring(1);
                if (attr.startsWith('#')) {
                    tName = realName;
                    template.removeAttribute(attr);
                } else if (attr.startsWith('$')) {
                    let attName = ATTR_PREFIX + '-' + realName;
                    tVars[attName] = template.getAttribute(attr);
                    template.removeAttribute(attr);
                    template.setAttribute(attName, tVars[attName]);
                } else if (attr.startsWith('@')) {
                    tEvents[realName] = template.getAttribute(attr);
                } else if (attr == 'style') {
                    globalStyle.textContent += `${tName} {${template.getAttribute(attr)}}`;
                }
            }

            if (!tName) {
                console.error('Template has no name:' + template.outerHTML);
                continue;
            }
            
            // (temporary)
            // template.innerHTML = template.innerHTML.replaceAll(/\{(.*)\}/g, `<span bind-${ATTR_PREFIX}$1></span>`);
            // TODO: impl. childNode approach

            function processElem(theElems = new HTMLCollection())
            {
                for (let x = 0; x < theElems.length; x += 1)
                {
                    let theElem = theElems[x];
                    if (theElem.firstElementChild == null) {
                        theElem.innerHTML = theElem.innerHTML.replaceAll(/\{(.*)\}/g, `<span ${ATTR_PREFIX}--bind="${ATTR_PREFIX}-$1"></span>`);
                    } else {
                        processElem(theElem.children);
                    }
                }
            }
            processElem(template.content.children);

            class TheElement extends HTMLElement // Code for Template's Instance
            {
                static observedAttributes = Object.keys(tVars);

                constructor() {
                    super();
                }

                connectedCallback()
                {
                    // Contents

                    this.innerHTML += template.innerHTML;

                    // Attrs

                    for (let attr of this.getAttributeNames()) {
                        let actualAttr = ATTR_PREFIX + '-' + attr;
                        this.setAttribute(actualAttr, this.getAttribute(attr));
                        this.removeAttribute(attr);
                    }

                    for (let attr of template.getAttributeNames()) {
                        if (attr == 'style' || attr.startsWith(ATTR_PREFIX)) {
                            continue;
                        }
                        
                        try {
                            this.setAttribute(attr, template.getAttribute(attr).trim());
                        } catch (DOMException) {
                            console.error(`Attribute '${attr}' is failed to apply from template to instance.`);
                            continue;
                        }
                    }

                    // Vars

                    let element = this;
                    element.$ = new Proxy({}, {
                        set(obj, prop, value)
                        {
                            prop = ATTR_PREFIX + '-' + prop;
                            if (!TheElement.observedAttributes.includes(prop)) {
                                console.error(`No prop '${prop}' decalred under template '${tName}'.`);
                            } else {
                                element.setAttribute(prop, JSON.stringify(value));
                            }
                        },
                        get(obj, prop, reciever)
                        {
                            prop = ATTR_PREFIX + '-' + prop;
                            if (!TheElement.observedAttributes.includes(prop)) {
                                console.error(`No prop '${prop}' decalred under template '${tName}'.`);
                                return undefined;
                            } else {
                                return JSON.parse(element.getAttribute(prop));
                            }
                        }
                    });
                    for (let sub of element.querySelectorAll('*')) {
                        sub.$ = element.$;
                    }

                    // run onconnect
                    let onConnect = this.getAttribute('onconnect');
                    new Function(onConnect).call(this);
                }

                attributeChangedCallback(name, ov, nv)
                {
                    this.querySelectorAll(`[${ATTR_PREFIX}--bind="${name}"]`).forEach(
                        (element) => {element.textContent = nv;}
                    );
                }
            }

            customElements.define(tName, TheElement);
        }
    }
    doIt();
}
