import { Router } from "@vaadin/router";
import { animationButton } from "../../libs/buttonAnimation";
import { state } from "../../state";
var lastEmail;

class MyInfo extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    async listeners() {
        const myInfoPage = document.querySelector("my-info");
        const form = myInfoPage?.querySelector("form");
        await valueForInputsForm(myInfoPage);
        form?.addEventListener("submit", async (e) => {
            e.preventDefault();
            //state send new data
            const full_name = e.target![0].value;
            const email = e.target![1].value;
            const password = e.target![2].value;

            //verify match password
            if (password && e.target![2].value !== e.target![3].value) {
                myInfoPage!.querySelector("span")!.textContent = "Contraseñas no coinciden";
            } else {
                e.submitter?.classList.add("activeLoading");
                myInfoPage!.querySelector("span")!.textContent = "";
                const status = await updateUserInfo(full_name, email, password);
                if (status) {
                    state.setState({ email });
                    //animation for updated user
                    const check = document.createElement("div");
                    check.innerHTML =
                        "<check-custom>Cuenta actualizada correctamente!</check-custom>";
                    myInfoPage?.appendChild(check);
                    check.classList.add("check");
                    //after animation go Home
                    setTimeout(() => {
                        Router.go("/inicio");
                    }, 2000);
                }
            }
        });
    }

    render() {
        //push in the path url
        history.pushState({}, "", "/mis-datos");
        const style = document.createElement("style");

        //inner components
        this.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home">
            <text-custom typeText="title">Mis datos</text-custom>
            <form class="form-personal-info">
            <div class="personal-container">
            <label for="input-full-name" class="label-full-name">NOMBRE</label>
            <input id="input-full-name" class="input-full-name">
            <label for="input-email" class="label-email">EMAIL</label>
            <input type="email" id="input-email" class="input-email">
            </div>
            <div class="password-container">
            <label for="input-password" class="label-password">NUEVA CONTRASEÑA</label>
            <input type="password" id="input-password" class="input-password">
            <label for="input-password-repeat" class="label-password-repeat">REPETIR CONTRASEÑA</label>
            <input type="password" id="input-password-repeat" class="input-password-repeat">
            <span class="incorrect"></span>
            <button class="form-button">Guardar datos<span class="load loading"></span></button>
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
customElements.define("my-info", MyInfo);

async function valueForInputsForm(pageEl) {
    const fullName = pageEl.querySelector(".input-full-name");
    const email = pageEl.querySelector(".input-email");
    const userData = await state.getUser();
    fullName.value = userData["full_name"];
    email.value = userData.email;
    lastEmail = email.value;
}

async function updateUserInfo(full_name, email, password) {
    const infoRecived = { full_name, email, password };
    //remove empty keys
    for (const key in infoRecived) {
        if (infoRecived[key] === "") delete infoRecived[key];
    }

    if (infoRecived.email && infoRecived.email !== lastEmail) {
        const existe = await state.verifyEmailExists(email);
        if (existe.status) {
            const emailExist = document.querySelector(".incorrect");
            emailExist!.textContent = "Este email ya se está utilizando";
            const button = document?.querySelector(".form-button");
            button?.classList.remove("activeLoading");
            return false;
        }
    }

    const infoUpdated = await state.updateInfoUser(infoRecived);
    return true;
}
