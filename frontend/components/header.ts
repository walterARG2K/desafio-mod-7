import { Router } from "@vaadin/router";
import { state } from "../state";
const logoImg = require("../images/logo-page.svg");
var switchTurn = true;
var email;
var haburgerEvent;
class Header extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    listeners() {
        //menu-burger click
        const hamburger = this.shadowRoot?.querySelector(".hamburger");
        haburgerEvent = () => {
            burgerMenuFuncionality();
            switchTurn ? (switchTurn = false) : (switchTurn = true);
        };
        hamburger?.addEventListener("click", haburgerEvent);

        //logo click
        const imgLogo = this.shadowRoot?.querySelector("img");
        imgLogo?.addEventListener("click", () => {
            Router.go("/inicio");
        });
    }

    render() {
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const container = document.createElement("div");
        const burgerMenu = document.createElement("div");
        const logo = document.createElement("img");
        //style for header
        style.textContent = `
            .header-container{
                height:60px;
                background-color:black;
                display:flex;
                flex-direction:column;
                justify-content:center;
                padding:0 35px
            }
            .container {
                width: 70%;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
}
            .visuallyHidden {
                position: absolute; 
                overflow: hidden; 
                clip: rect(0 0 0 0); 
                height: 1px; width: 1px; 
                margin: -1px; padding: 0; border: 0; 
}


            .hamburger {
                width: 30px;
                height: 30px;
                position: absolute;
                top:15px;
                right:40px;
                z-index:3;
                user-select: none;
}
            .hamburger .bar {
                padding: 0;
                width: 30px;
                height: 4px;
                background-color: white;
                display: block;
                border-radius: 4px;
                transition: all 0.4s ease-in-out;
                position: absolute; 
}

            .bar1 {
                top: 0;
}

            .bar2, .bar3 {
                top: 13.5px;
}

            .bar3 {
                right: 0;
}

            .bar4 {
                bottom: 0;
}

            .burger:checked + label > .hamburger > .bar1{
                transform: translateX(40px);
                background-color: transparent;
}

            .burger:checked + label > .hamburger > .bar2{
                transform: rotate(45deg);
}

            .burger:checked + label > .hamburger > .bar3{
                transform: rotate(-45deg);
}

            .burger:checked + label > .hamburger > .bar4{
                transform: translateX(-40px);
                background-color: transparent;
}

            .logo{
                width:40px;
                height:40px;
                cursor:pointer;
            }
`;

        //set attributes
        container.classList.add("header-container");
        logo.classList.add("logo");

        logo.setAttribute("src", logoImg);
        burgerMenu.innerHTML = `
           <input type="checkbox" id="burger" class="burger visuallyHidden">
        <label for="burger">
            <div class="hamburger">
                <span class="bar bar1"></span>
                <span class="bar bar2"></span>
                <span class="bar bar3"></span>
                <span class="bar bar4"></span>
            </div>
        </label>

            `;
        //append childs
        container.appendChild(logo);
        container.appendChild(burgerMenu);
        shadow.appendChild(container);
        shadow.appendChild(style);
        this.listeners();
    }
}
customElements.define("header-custom", Header);

async function burgerMenuFuncionality() {
    const rootEl = document.querySelector(".root");
    const menu = document.createElement("menu-custom");
    switchTurn ? await rootEl?.appendChild(menu) : rootEl?.childNodes[1]?.remove();

    //view email user in menu
    const menuEl = document.querySelector("menu-custom")?.shadowRoot;
    const closeSession = menuEl?.querySelector(".close-sesion");
    const initSession = menuEl?.querySelector(".init-sesion");
    const tokenUser = state.token;
    if (!closeSession && tokenUser && initSession) {
        initSession!.innerHTML = ``;
        initSession?.setAttribute("class", "close-sesion");
        const emailUser = email || (await state.getUser());
        email = emailUser;
        initSession!.innerHTML = `
        <p class="mail">${emailUser.email}</p>
        <p class="close-sesion">CERRAR SESIÓN</p>
        `;
    }
    menuLinks();
}

async function menuLinks() {
    const rootEl = document.querySelector(".root");
    const menuEl = document.querySelector("menu-custom")?.shadowRoot;
    const headerEl = rootEl?.querySelector("header-custom")?.shadowRoot;
    const myInfo = menuEl?.querySelector(".my-info");
    const petsReported = menuEl?.querySelector(".pets-reported");
    const reportPet = menuEl?.querySelector(".report-pet");
    const initSession = menuEl?.querySelector(".init-sesion");
    const closeSession = menuEl?.querySelector(".close-sesion");
    const hamburger = headerEl?.querySelector(".hamburger");
    //"Mis datos" section
    myInfo?.addEventListener("click", () => {
        switchTurn = true;
        closeAndOpenBurger(hamburger);
        if (rootEl?.children[1]) rootEl?.children[1].remove();
        if (state.token) Router.go("/mis-datos");
        else Router.go("/iniciar-sesion");
    });

    //"Mis mascotas reportadas" section
    petsReported?.addEventListener("click", () => {
        switchTurn = true;
        closeAndOpenBurger(hamburger);
        if (rootEl?.children[1]) rootEl?.children[1].remove();
        if (state.token) Router.go("/mis-mascotas-reportadas");
        else Router.go("/iniciar-sesion");
    });
    //"Reportar mascota" section
    reportPet?.addEventListener("click", () => {
        switchTurn = true;
        closeAndOpenBurger(hamburger);
        if (rootEl?.children[1]) rootEl?.children[1].remove();
        if (state.token) Router.go("/reportar-mascota");
        else Router.go("/iniciar-sesion");
    });

    //"iniciar sesión" section
    if (initSession)
        initSession?.addEventListener("click", () => {
            switchTurn = true;
            closeAndOpenBurger(hamburger);
            if (rootEl?.children[1]) rootEl?.children[1].remove();
            Router.go("/iniciar-sesion");
        });
    //"cerrar sesión" section
    if (closeSession) {
        closeSession?.addEventListener("click", () => {
            switchTurn = true;
            closeAndOpenBurger(hamburger);
            if (rootEl?.children[1]) rootEl?.children[1].remove();
            state.logout();
            state.setState({});
            Router.go("/iniciar-sesion");
        });
    }
}

function closeAndOpenBurger(hamburger) {
    hamburger?.removeEventListener("click", haburgerEvent);
    (hamburger as any).click();
    hamburger?.addEventListener("click", haburgerEvent);
}
