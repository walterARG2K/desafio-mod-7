import { Router } from "@vaadin/router";
import { dropzone, dataUrl } from "../../libs/dropzone";
import { Mapbox } from "../../libs/mapbox";
import { state } from "../../state";

var location = false;
class EditPet extends HTMLElement {
    connectedCallback() {
        const token = state.token;
        if (token) {
            this.render();
        } else {
            state.setState({ location: "/reportar-mascota" });
            Router.go("/iniciar-sesion");
        }
    }

    async listeners() {
        await dropzone("#dropzonejs-report");
        const mapboxInstance = new Mapbox("map");
        await mapboxInstance.initMapbox();

        //form mapbox
        searchLocationForm();
        const buttonSend = document.querySelector("button-custom");
        buttonSend?.addEventListener("click", (e) => {
            e.preventDefault();
            const reportPage = document.querySelector("report-pet");
            //submit pet
            reportPet(reportPage, location);
        });

        //cancel report
        const buttonCancel = document.querySelector(".cancelReport");
        buttonCancel?.addEventListener("click", (e) => {
            e.preventDefault();
            Router.go("/inicio");
        });
    }

    render() {
        //push in the path url
        history.pushState({}, "", "/reportar-mascota");

        const style = document.createElement("style");
        //inner components
        this.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home">
            <text-custom typeText="title">Reportar una mascota perdida</text-custom>
            <form class="form-name">
            <label for="input-name" class="label-name">NOMBRE</label>
            <input type="name" required id="input-name" class="input-name">
            <div class="div" style="margin:10px 0">
                <div style="display:flex;justify-content:center;">
                    <div  class="dropzone" id="dropzonejs-report">
                    </div>
                </div>
            </div>
            </form>
            <div id="map" style="width: 78%; height: 30vh; max-width:328px"></div>
            <form class="search-form">
                <label for="input-location" class="label-location">UBICACIÓN</label>
            <input name="q" type="search" required id="input-location" class="input-location">
                    <button class="button-search">Buscar ubicación</button>
            </form>
            <text-custom style="max-width: 329px; width: 70vw;margin-top:10px" 
            typeText="paragraph">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</text-custom>
            <hr class="solid">
            <span class="error"></span>
            <button-custom buttonType="secondButton">Reportar como perdido</button-custom>
            <button-custom buttonType="thirdButton" class="cancelReport">Cancelar reporte</button-custom>
            </div>
            `;

        //adding styles
        style.textContent = `
             .container-home{
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:20px;
            padding: 10vh 20px;
            }
            .input-name, .input-location{
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

        .form-button, .button-search{
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
        hr.solid {
            border-top: 3px solid #464646;
            width:79%;
            max-width:325px;
        }
        span{
            color:red;
            text-align:center;
        }
        .check{
            position:fixed;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index:5;
        }
       `;
        this.appendChild(style);
        this.listeners();
    }
}
customElements.define("report-pet", EditPet);

async function reportPet(pageEl, location) {
    var infoPet = {};
    const errorText = pageEl.querySelector(".error");
    const namePet = pageEl.querySelector(".input-name").value;
    const urlImage = dataUrl;

    //verify fields not are emptys
    if (!namePet) errorText.textContent = "Debe ingresar nombre de su mascota";
    else if (urlImage === undefined) errorText.textContent = "Agregue una foto de su mascota";
    else if (!location) errorText.textContent = "Dinos la última ubicación";
    else if (namePet && urlImage) {
        //animations
        const buttonCustom = document.querySelector("button-custom")?.shadowRoot;
        const buttonEl = buttonCustom!.querySelector(".secondButton");
        buttonEl?.classList.add("activeLoading");
        errorText.textContent = "";

        infoPet = {
            name: namePet,
            state: "perdido",
            dataUrl: urlImage,
            location,
            ...state.getState(),
        };
        const petReport = await state.createPetReport(infoPet);

        //animation
        const check = document.createElement("div");
        check.innerHTML = "<check-custom>Mascota reportada correctamente!</check-custom>";
        check.classList.add("check");
        pageEl.appendChild(check);

        setTimeout(() => {
            Router.go("/mis-mascotas-reportadas");
        }, 2000);
    }
}

function searchLocationForm() {
    const form = document.querySelector(".search-form");
    form?.addEventListener("submit", (e) => {
        e.preventDefault();
        location = e.target!["input-location"].value;
    });
}
