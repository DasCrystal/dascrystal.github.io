
let selector = (string) => document.querySelector(string);

let Ui = {

    showQuad: function(title, content) {
    
        let quad = `<quad>${title} ${content}</quad>`

    },

    showMenu: function() {

        let menu = selector("#menu");
        let disp = menu.style.display;
        
        console.log(disp);

        if (disp == "none") {

            menu.style.display = "block";

        } else {

            menu.style.display = "none";

        }
         

    },

}
