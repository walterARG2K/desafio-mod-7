import { state } from "../state";

class HeaderMenu extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    async render() {
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const container = document.createElement("div");
        //style for header
        style.textContent = `
        .container-menu{
            position:fixed;
            top:0;
            display:flex;
            flex-direction:column;
            gap:70px;
            background-color:#1f1e26;
            width:100%;
            padding:120px 0;
            height:100vh;
	        animation: slide-top 0.7s ease-in reverse forwards;
            text-align:center;
            z-index:2;

    }

@keyframes slide-top {
    0% {
            -webkit-transform: translateY(0px);
            transform: translateY(0px);
  }
    100% {
            -webkit-transform: translateY(-100px);
            transform: translateY(-100px);
  }
}
    .mail, .close-sesion{
        color:#fff;
        font-size:18px;
        margin:0;
    }

    .close-sesion, .init-sesion{
        color:#fff;
        cursor:pointer;
        text-decoration-line:underline;
        width:100%;
    }
    
    .my-info, .pets-reported, .report-pet{
        cursor:pointer;
    }
    
    .signed-container{
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction:column;
    }`;

        const userSigned = state.getState().email;

        //set attributes
        container.classList.add("container-menu");
        container.innerHTML = `
        <text-custom class="my-info">Mis datos</text-custom>
        <text-custom class="pets-reported">Mis mascotas reportadas</text-custom>
        <text-custom class="report-pet">Reportar mascota</text-custom>
        `;

        //append element if user login
        const signedEl = document.createElement("div");
        signedEl.classList.add("signed-container");
        if (userSigned) {
            signedEl.innerHTML = `
            <p class="mail">${userSigned}</p>
            <p class="close-sesion">CERRAR SESIÓN</p>
            `;
        } else {
            signedEl.innerHTML = `
            <p class="init-sesion">INICIAR SESIÓN</p>
            `;
        }
        //append childs
        container.appendChild(signedEl);
        shadow.appendChild(container);
        shadow.appendChild(style);
    }
}
customElements.define("menu-custom", HeaderMenu);
