import { Router } from "@vaadin/router";
import { animationButton } from "../../libs/buttonAnimation";
import { state } from "../../state";
const style = document.createElement("style");
class Session extends HTMLElement {
    connectedCallback() {
        const token = state.token;
        if (token) {
            Router.go("/mis-datos");
        } else {
            this.render();
        }
    }

    listeners() {
        const sessionPage = document.querySelector("session-page");
        const form = sessionPage?.querySelector("form");

        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            (e.submitter as HTMLButtonElement).disabled = true;
            //animation button
            e.submitter?.classList.add("activeLoading");

            //verify if email already exists
            const emailExist = await state.verifyEmailExists(e.target![0].value);

            if (emailExist.status) {
                //input password page
                sessionPage!.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home">
            <text-custom typeText="title">Ingresar</text-custom>
            <form class="form-password">
            <label for="input-password" class="label-password">CONTRASEÑA</label>
            <input required type="password" id="input-password" class="input-password">
            <span></span>
            <button class="form-button">Siguiente<span class="load loading"></span></button>
            </form>
            </div>
            `;
                sessionPage?.appendChild(style);
                sendEmailAndPassword(e.target![0].value);
            } else {
                state.setState({ uemail: e.target![0].value });
                Router.go("/registrarse");
            }
        });
    }

    render() {
        //push in the path url
        history.pushState({}, "", "/iniciar-sesion");

        //inner components
        this.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home">
            <text-custom typeText="title">Ingresar</text-custom>
            <form class="form-email">
            <label for="input-email" class="label-email">EMAIL</label>
            <input type="email" required id="input-email" class="input-email" placeholder="nombre@correo.org">
            <button class="form-button">Siguiente<span class="load loading"></span></button>
            </form>
            </div>
            `;

        //adding styles
        style.textContent =
            `
            .container-home{
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:70px;
            padding: 10vh 20px;
            }
            .input-email, .input-password{
            max-width:330px;
            height:40px;
            box-sizing:border-box;
            outline:none;
            padding:10px;
            font-size: 18px;
            font-family: Poppins;
            width:70vw;
        }
            form{
            display:flex;
            flex-direction:column;
            gap:10px;
            color:#fff;
            }

        .form-button{
            font-family:'Poppins';
            font-weight:600;
            font-size: 18px;
            width:100%;
            max-width:330px;
            color:#fff;
            background-color: #000;
            height:50px;
            border: none;
            border-radius: 3px;
            margin-top:10px;
        }
        .error{
            text-align: center;
            color: red;
        }
            ` + animationButton();
        this.appendChild(style);
        this.listeners();
    }
}
customElements.define("session-page", Session);

function sendEmailAndPassword(inputDataEmail) {
    const password = document.querySelector("session-page")?.querySelector("form");
    password?.addEventListener("submit", async (e) => {
        e.preventDefault();
        (e.submitter as HTMLButtonElement).disabled = true;
        //alert password incorrect removing text
        const password = document.querySelector("session-page")?.querySelector("span");
        password!.textContent = "";
        //animation button
        e.submitter?.classList.add("activeLoading");
        const loginStatus = await state.login(inputDataEmail, e.target![0].value);
        //very if password is correct
        if (loginStatus === 200) {
            //get location user clicked before redirect here
            const page = state.getState().location || "/mis-datos";
            state.setState({ email: inputDataEmail });
            Router.go(page);
        } else {
            (e.submitter as HTMLButtonElement).disabled = false;
            e.submitter?.classList.remove("activeLoading");
            const password = document.querySelector("session-page")?.querySelector("span");
            password!.textContent = "Contraseña incorrecta!";
            password?.classList.add("error");
        }
    });
}
