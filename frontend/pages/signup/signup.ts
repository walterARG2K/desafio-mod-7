import { Router } from "@vaadin/router";
import { animationButton } from "../../libs/buttonAnimation";
import { state } from "../../state";

class Signup extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    listeners() {
        const signupPage = document.querySelector("signup-page");
        const form = signupPage?.querySelector("form");
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            (e.submitter as HTMLButtonElement).disabled = true;
            //state send new data
            if (e.target![2].value !== e.target![3].value) {
                signupPage!.querySelector("span")!.textContent = "Contraseñas no coinciden";
                (e.submitter as HTMLButtonElement).disabled = false;
            } else {
                signupPage!.querySelector("span")!.textContent = "";
                //only apply animations
                const check = document.createElement("div");
                check.innerHTML = "<check-custom>Cuenta creada correctamente!</check-custom>";
                check.classList.add("check");
                e.submitter?.classList.add("activeLoading");
                //send data to state
                const userName = e.target![0].value;
                const email = e.target![1].value;
                const password = e.target![2].value;
                const status = await createUser(userName, email, password);
                if (status) {
                    state.setState({ email });
                    //more animation
                    signupPage?.appendChild(check);
                    //after animations go to signin
                    setTimeout(() => {
                        Router.go("/iniciar-sesion");
                    }, 2000);
                } else {
                    e.submitter?.classList.remove("activeLoading");
                    (e.submitter as HTMLButtonElement).disabled = false;
                }
            }
        });
    }

    render() {
        //push in the path url
        history.pushState({}, "", "/registrarse");
        const style = document.createElement("style");

        //inner components
        this.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home">
            <text-custom typeText="title">Registrarse</text-custom>
            <form class="form-personal-info">
            <div class="personal-container">
            <label for="input-full-name" class="label-full-name">NOMBRE</label>
            <input required id="input-full-name" class="input-full-name">
            <label for="input-email" class="label-email">EMAIL</label>
            <input required type="email" id="input-email" class="input-email" value=${
                state.getState().uemail || ""
            }>
            </div>
            <div class="password-container">
            <label for="input-password" class="label-password">NUEVA CONTRASEÑA</label>
            <input required type="password" id="input-password" class="input-password">
            <label for="input-password-repeat" class="label-password-repeat">REPETIR CONTRASEÑA</label>
            <input required type="password" id="input-password-repeat" class="input-password-repeat">
            <span class="incorrect"></span>
            <button class="form-button">Crear cuenta<span class="load loading"></span></button>
            </div>
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

            .personal-container, .password-container{
            display:flex;
            flex-direction:column;
            }

            .input-email, .input-full-name, .input-password-repeat,.input-password{
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
            gap:60px;
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
            
        .incorrect{
            color:red;
            text-align:center;
        }
        
        .check{
            position:fixed;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index:5;
        }` + animationButton();
        this.appendChild(style);
        this.listeners();
    }
}
customElements.define("signup-page", Signup);

async function createUser(fullname, email, password) {
    const userInfo = {
        full_name: fullname,
        email,
        password,
    };
    const exist = await state.verifyEmailExists(email);
    if (exist.status === true) {
        const existEmail = document.querySelector(".incorrect");
        existEmail!.textContent = "Email ya está en uso";
        return false;
    } else {
        await state.createUser(userInfo);
        return true;
    }
}
