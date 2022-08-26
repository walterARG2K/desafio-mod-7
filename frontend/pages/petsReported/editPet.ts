import { Router } from "@vaadin/router";
import { dropzone, dataUrl } from "../../libs/dropzone";
import { Mapbox, marker, map } from "../../libs/mapbox";
import { state } from "../../state";
var petId;
class EditPet extends HTMLElement {
    connectedCallback() {
        const token = state.token;
        if (token) {
            this.render();
        } else {
            state.setState({ location: "/mis-mascotas-reportadas/editar" });
            Router.go("/iniciar-sesion");
        }
    }

    listeners() {
        petId = state.getState();
        dropzone("#dropzonejs-edit");
        const mapboxInstance = new Mapbox("editPet");
        mapboxInstance.initMapbox();
        const pageEl = document.querySelector(".container-home");
        petInfoFileds(pageEl, map);
    }

    render() {
        //push in the path url
        history.pushState({}, "", "/mis-mascotas-reportadas/editar");

        const style = document.createElement("style");
        //inner components
        this.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home">
            <text-custom typeText="title">Editar mascota perdida</text-custom>
            <form class="form-name">
            <label for="input-name" class="label-name">NOMBRE</label>
            <input type="name" required id="input-name" class="input-name">
            <div class="div" style="margin:10px 0">
                <div style="display:flex;justify-content:center;">
                    <div  class="dropzone" id="dropzonejs-edit">
                    </div>
                </div>
            </div>
            </form>
            <div id="editPet" style="width: 78%; height: 30vh; max-width:328px"></div>
            <form class="search-form">
                <label for="input-location" class="label-location">UBICACIÓN</label>
            <input name="q" type="search" required id="input-location" class="input-location">
                    <button class="button-search">Buscar ubicación</button>
            </form>
            <text-custom style="max-width: 329px; width: 70vw;margin-top:10px" 
            typeText="paragraph">Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</text-custom>
            <hr class="solid">
            <button-custom class="secondButton" buttonType="secondButton">Guardar</button-custom>
            <button-custom class="thirdButton" buttonType="thirdButton">Reportar como encontrado</button-custom>
            <button class="unpublic">Eliminar publicación</button>
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
        .unpublic{
        cursor:pointer;
        text-decoration-line:underline;
        color:red;
        border: none;
        background-color: transparent;
        font-size: 16px;
        font-family: "Poppins";
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
customElements.define("edit-pet", EditPet);

async function petInfoFileds(pageEl, map) {
    const buttonReport = pageEl.querySelector(".thirdButton");
    const name = pageEl.querySelector(".input-name");
    const urlImage = pageEl.querySelector(".dropzone");
    var location;
    var coordinates;

    //petLastInfo
    const petid = petId.petId || localStorage.getItem("petId");
    const petInfo = await getPetInfo(petid);
    //button if losted o finded
    const buttonEl = buttonReport.shadowRoot.querySelector("button");
    if (petInfo.state !== "perdido")
        buttonEl.innerHTML = "Reportar como perdido<span class='load loading'></span>";
    // pet image
    urlImage.setAttribute("style", "background-image:" + `url(${petInfo.urlImage})`);

    //pet name
    name.value = petInfo.name;
    const searchForm = document.querySelector(".search-form");

    //if update location
    searchForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        location = e.target![0].value;
        coordinates = state.getState();
    });
    marker.setLngLat([petInfo.lng, petInfo.lat]).addTo(map);
    map.setCenter([petInfo.lng, petInfo.lat]);
    map.setZoom(14);
    pageEl.querySelector(".dz-message").remove();

    //pet updateInfo
    const buttonUpdate = pageEl.querySelector(".secondButton");
    buttonUpdate.addEventListener("click", async (e) => {
        //animation button
        const button = buttonUpdate.shadowRoot.querySelector("button");
        button.classList.add("activeLoading");
        buttonUpdate.disabled = true;
        const dataPet = { name: name.value, dataUrl, location };
        await updateInfo(dataPet, coordinates);

        //more animations
        const check = document.createElement("div");
        check.innerHTML = "<check-custom>Mascota actualizada correctamente!</check-custom>";
        check.classList.add("check");
        pageEl.appendChild(check);

        //after animation go before page
        setTimeout(() => {
            Router.go("/mis-mascotas-reportadas");
        }, 2000);
    });

    //report pet finded
    const status = buttonReport.shadowRoot.querySelector("button").textContent.split(" ")[2];

    buttonReport.addEventListener("click", async (e) => {
        buttonReport.disabled = true;

        //button animation
        const button = buttonReport.shadowRoot.querySelector("button");
        button.classList.add("activeLoading");
        await updateInfo({ state: status }, coordinates);

        //more animation
        const check = document.createElement("div");
        check.innerHTML = "<check-custom>Mascota actualizada correctamente!</check-custom>";
        check.classList.add("check");
        pageEl.appendChild(check);
        //after animation go before page
        setTimeout(() => {
            Router.go("/mis-mascotas-reportadas");
        }, 2000);
    });

    //pet delete
    const unpublic = pageEl.querySelector(".unpublic");
    const onClick = async (e) => {
        unpublic.disabled = true;
        //delete pet
        await petDelete();
        //animations
        const check = document.createElement("div");
        check.innerHTML = "<check-custom>Mascota eliminada correctamente!</check-custom>";
        check.classList.add("check");
        pageEl.appendChild(check);
        //after animation go before page
        setTimeout(() => {
            Router.go("/mis-mascotas-reportadas");
        }, 2000);
    };
    unpublic.addEventListener("click", onClick);
}

async function updateInfo(dataPet, coordinates) {
    if (state.getState().lng) coordinates = state.getState();
    const lat = coordinates ? coordinates.lat : undefined;
    const lng = coordinates ? coordinates.lng : undefined;
    const infoRecived = {
        ...dataPet,
        lat,
        lng,
        dataUrl,
    };
    for (const key in infoRecived) {
        if (infoRecived[key] === undefined) delete infoRecived[key];
    }
    const petid = petId.petId || localStorage.getItem("petId");
    return await state.updateInfoPet(infoRecived, petid);
}

async function getPetInfo(petId) {
    const petInfo = await state.getOnePet(petId);
    return petInfo;
}

async function petDelete() {
    const petid = petId.petId || localStorage.getItem("petId");
    return await state.deletePet(petid);
}
