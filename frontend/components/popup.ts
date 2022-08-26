import { animationButton } from "../libs/buttonAnimation";
const img = require("../images/cruz.svg");
class Popup extends HTMLElement {
    constructor() {
        super();
        this.render();
    }
    listeners() {
        const form = this.shadowRoot?.querySelector("form");
        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            (e.submitter as HTMLButtonElement).disabled = true;
            const name = e.target!["input-reporter-name"].value;
            const phoneNumber = e.target!["input-reporter-phone"].value;
            const description = e.target!["description-reporter"].value;
            this.dispatchEvent(
                new CustomEvent("sendMail", {
                    detail: {
                        name,
                        phoneNumber,
                        description,
                    },
                    bubbles: true,
                })
            );
        });

        //event custom close popup
        const imgClose = this.shadowRoot?.querySelector("img");

        imgClose?.addEventListener("click", (e) => {
            this.dispatchEvent(
                new CustomEvent("closePopup", {
                    detail: {
                        click: true,
                    },
                    bubbles: true,
                })
            );
        });
    }

    render() {
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const containerPopup = document.createElement("div");
        const containerElements = document.createElement("div");
        //styles
        style.textContent =
            `
            .container-popup{
                top: 52%;
                position: fixed;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 82%;
                background-color:rgb(57, 56, 68);
                z-index:4;
                max-width:500px
            }

            form{
            display:flex;
            flex-direction:column;
            align-items:center;
            }

        .container-name-reporter, .container-phone-reporter, .container-description-reporter{
            display:flex;
            flex-direction:column;
            padding: 10px 0;
        }

        .input-name-reporter, .input-phone-reporter, .description-reporter{
            max-width:330px;
            height:40px;
            box-sizing:border-box;
            outline:none;
            padding:10px;
            font-size: 18px;
            font-family: Poppins;
            width:70vw;
        }

        .description-reporter{
            height:180px;
        }

        .name-reporter, .phone-reporter, .description-reporter-label{
        margin-bottom:5px;
        color:#fff;
        }
        .container-first{
            margin-bottom:25px
        }

        .container-img{
            display:flex;
            flex-direction:column;
            align-items:end;
            margin: 15px 15px 34px;
        }
        .button-form{
            font-family:'Poppins';
            font-weight:600;
            font-size: 18px;
            width:85%;
            max-width:330px;
            color:#fff;
            background-color: #000;
            height:50px;
            border: none;
            border-radius: 3px;
            margin-bottom:20px;
        }
        ` + animationButton();
        //adding attributes
        containerPopup.classList.add("container-popup");

        //setting content
        containerElements.innerHTML = `
        <div class="container-first">
        <div class="container-img">
        <img style="height:20px; cursor:pointer" src="${img}">
        </div>
        <text-custom typeText="subtitle" class="subtitle">Reportar info de ${this.getAttribute(
            "nombre"
        )}</text-custom>
        </div>
        <form>
        <div class="container-name-reporter">
        <label for="input-reporter-name" class="name-reporter">TU NOMBRE</label>
        <input required id="input-reporter-name" class="input-name-reporter">
        </div>
        <div class="container-phone-reporter">
        <label for="input-reporter-phone" class="phone-reporter">TU TÉLEFONO</label>
        <input required id="input-reporter-phone" class="input-phone-reporter">
        </div>
        <div class="container-description-reporter">
        <label for="description-reporter" class="description-reporter-label">¿DONDE LO VISTE?</label>
        <textarea required class="description-reporter" name="description-reporter" id="description-reporter"></textarea>
        </div>
        <button class="button-form">Enviar<span class='load loading'></span></button>
        </form>
        `;

        //append childs
        containerPopup.appendChild(containerElements);
        shadow.appendChild(containerPopup);
        shadow.appendChild(style);
        this.listeners();
    }
}

customElements.define("popup-custom", Popup);
