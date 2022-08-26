import { animationButton } from "../libs/buttonAnimation";
class Button extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const container = document.createElement("div");
        const button = document.createElement("button");

        //styles
        style.textContent =
            `
            .container{
            display:flex;
            flex-direction:column;
            align-items:center;
            }
            .firstButton, .secondButton, .thirdButton{
            font-family:'Poppins';
            font-weight:600;
            font-size: 18px;
            width:70vw;
            max-width:330px;
            color:#fff;
            background-color: #000;
            height:50px;
            border: none;
            border-radius: 3px;
            margin:0px;
            }
            .secondButton{
            background-color: #4161ac;
            }
            .thirdButton{
            background-color: #4A4A4A;
            }
` + animationButton();

        //set attributes
        container.classList.add("container");
        button.innerHTML = this.textContent + "<span class='load loading'></span>";
        //select type button
        const typeButton = this.getAttribute("buttonType") || "firstButton";
        button.classList.add(typeButton);
        // append childs
        container.appendChild(button);
        shadow.appendChild(style);
        shadow.appendChild(container);
    }
}
customElements.define("button-custom", Button);
