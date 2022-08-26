import { state } from "../../state";

export async function aceptedLocation(location) {
    //find elements
    const textEl = document.querySelector(".paragraph");
    const buttonEl = document.querySelector("button-custom");

    //create cards
    const containerHome = document.querySelector(".container-home");
    const card = document.createElement("card-custom");
    card.textContent = "REPORTAR INFORMACIÓN";
    const { latitude, longitude } = location.coords;
    const collectionPets = await state.getPetsLost(latitude, longitude);
    //remove element after promise

    buttonEl?.remove();
    var counter = 0;

    //if not find pets losted
    const text = textEl!.shadowRoot!.querySelector("p");
    if (collectionPets.length !== undefined) textEl?.remove();
    else text!.textContent = "No hay mascotas perdidas cerca de tu ubicación";

    //create new cards with pets
    while (counter < collectionPets.length) {
        const { name, id, urlImage, location } = collectionPets[counter];
        //information for card
        card.setAttribute("nombre", name);
        card.setAttribute("ubicacion", location);
        card.setAttribute("pet-id", id);
        card.setAttribute("url", urlImage);

        //style necessary for cards
        card.setAttribute(
            "style",
            `display: flex;
            flex-direction: column;
            align-items: center;`
        );

        //clone element to use multiple times
        const cardClone = card.cloneNode(true);

        //custom event click report pet
        cardClone.addEventListener("report", (e) => {
            const namePet = (e.target as any).attributes["nombre"].value;
            state.setState((e.target as any).attributes["pet-id"].value);
            popUpFuncionality(namePet, containerHome);
            closePopup();
        });
        if (collectionPets[counter].state === "perdido") containerHome?.appendChild(cardClone);
        counter++;
    }
    //append new data
    return location;
}

function popUpFuncionality(namePet, pageEl) {
    //style background popup open
    const rootEl = document.querySelector(".root");
    const container = document.createElement("div");
    const background = document.createElement("div");

    //style background
    background.setAttribute(
        "style",
        `background-color:#000000bf; position:fixed;
        width:100%;height:100vh;top:0;z-index:3`
    );
    //creating popup element
    container.innerHTML = `<popup-custom nombre=${namePet}></popup-custom>`;
    background.classList.add("background-color");
    rootEl?.appendChild(container);
    rootEl?.appendChild(background);

    const popup = document.querySelector("popup-custom");
    popup?.addEventListener("sendMail", async (e) => {
        //animation Button send

        const button = document.querySelector("popup-custom")?.shadowRoot?.querySelector("button");
        button?.classList.add("activeLoading");

        e.preventDefault();

        const reportInfo = {
            reporter: (e as any).detail.name,
            phone_number: (e as any).detail.phoneNumber,
            description: (e as any).detail.description,
        };
        const { id, UserId } = await state.getOnePet(state.getState());
        await state.reportInfo(UserId, id, reportInfo);

        //animation
        const check = document.createElement("div");
        check.innerHTML = "<check-custom>Info enviada correctamente!</check-custom>";
        check.classList.add("check");
        check.setAttribute(
            "style",
            `
            position:fixed;
            top: 52%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index:5;
        `
        );
        pageEl?.appendChild(check);

        setTimeout(() => {
            pageEl.querySelector(".check").remove();
            const popup = document.querySelector("popup-custom");
            const imgClose = popup!.shadowRoot?.querySelector("img");
            imgClose?.click();
        }, 2000);
    });
}

function closePopup() {
    const popup = document.querySelector("popup-custom");
    const rootEl = document.querySelector(".root");

    popup?.addEventListener("closePopup", (e) => {
        rootEl?.childNodes[1].remove();
        rootEl?.childNodes[1].remove();
    });
}
