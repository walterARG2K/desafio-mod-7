import { Router } from "@vaadin/router";
import { state } from "../../state";

class PetsReported extends HTMLElement {
    connectedCallback() {
        const token = state.token;
        if (token) {
            this.render();
        } else {
            state.setState({ location: "/mis-mascotas-reportadas" });
            Router.go("/iniciar-sesion");
        }
    }

    listeners() {
        const cardEditable = document.querySelector("card-editable-custom");
        cardEditable?.addEventListener("editPet", (e) => {
            //set state, id pet
            Router.go("/mis-mascotas-reportadas/editar");
        });
    }

    async render() {
        //push in the path url
        history.pushState({}, "", "/mis-mascotas-reportadas");

        const style = document.createElement("style");
        //inner components
        this.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home2">
            <text-custom typeText="title">Mis mascotas reportadas</text-custom>
            </div>
            `;

        //adding styles
        style.textContent = `
            .container-home2{
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
            `;
        this.appendChild(style);

        //search pets reported
        const pageEl = document.querySelector(".container-home2");
        this.listeners();
        await cardsPetsReported(pageEl);
    }
}
customElements.define("pets-reported", PetsReported);

async function cardsPetsReported(pageEl) {
    const collectionPetsUser = await state.getPetsReportedByUser();
    const card = document.createElement("card-custom");
    card.textContent = "✏ EDITAR INFORMACIÓN";
    var counter = 0;
    if (!collectionPetsUser.length) {
        const divEl = document.createElement("div");
        divEl.innerHTML = `<text-custom typeText="paragraph">Aún no has reportado a ninguna mascota como perdida</text-custom>`;
        pageEl.appendChild(divEl);
    }
    while (counter < collectionPetsUser.length) {
        const { name, id, urlImage, location } = collectionPetsUser[counter];

        //information for card
        card.setAttribute("nombre", name);
        card.setAttribute("ubicacion", location);
        card.setAttribute("pet-id", id);
        card.setAttribute("url", urlImage);

        const cardClone = card.cloneNode(true);
        //event listener if click edit Pet
        cardClone.addEventListener("report", (e) => {
            const petId = (e.target as any).attributes["pet-id"].value;
            state.setState({ petId });
            localStorage.setItem("petId", petId);
            Router.go("/mis-mascotas-reportadas/editar");
        });
        pageEl?.appendChild(cardClone);
        counter++;
    }
}
