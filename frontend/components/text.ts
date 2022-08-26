class TextCustom extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        const elementType = this.getAttribute("typeText") || "title";
        const typesText = { title: "h1", subtitle: "h3", paragraph: "p" };
        const shadow = this.attachShadow({ mode: "open" });
        const container = document.createElement("div");
        const style = document.createElement("style");
        const textEl = document.createElement(typesText[elementType]);

        //styles
        style.textContent = `
            .container{
                display:flex;
                flex-direction:column;
                align-items:center;
                text-align:center;
}

            .title, .paragraph, .subtitle{
                color:#fff;
                font-size: 32px;
                font-weight:700;
                font-family:'Poppins';
                margin:0px;
}

            .subtitle{
                font-size: 24px;
                font-weight:600;
}
           .paragraph{
                font-size: 18px;
                font-weight:500;
                text-transform: Uppercase;

}
            `;

        //set attributes
        container.classList.add("container");
        textEl.classList.add(elementType);
        textEl.textContent = this.textContent;
        //append childs
        container.appendChild(textEl);
        shadow.appendChild(container);
        shadow.appendChild(style);
    }
}
customElements.define("text-custom", TextCustom);
