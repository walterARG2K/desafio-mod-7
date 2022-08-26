import { aceptedLocation } from "./check-location";
class Home extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    listeners() {
        const button = this.querySelector("button-custom")?.shadowRoot?.querySelector("button");
        button!.addEventListener("click", (e) => {
            e.preventDefault();
            //animation for button
            button?.classList.add("activeLoading");
            //disabled click for button
            button!.disabled = true;
            //get location user
            if (!("geolocation" in navigator)) {
                return alert("Tu navegador no soporta el acceso a la ubicación. Intenta con otro");
            }
            navigator.geolocation.getCurrentPosition(aceptedLocation, () => {
                alert(
                    "Ha rechazado dar su ubicación, si desea volver a intentar, vuelva a cargar el sitio"
                );
            });
        });
    }

    render() {
        //push in the path url
        history.pushState({}, "", "/inicio");
        const style = document.createElement("style");

        //inner components
        this.innerHTML = `
            <header-custom></header-custom>
            <div class="container-home">
            <text-custom typeText="title">Mascotas perdidas cerca tuyo</text-custom>
            <text-custom typeText="paragraph" class="paragraph">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</text-custom>
            <div><button-custom>Dar mi ubicación</button-custom><div>
            </div>
            `;

        //adding styles
        style.textContent = `
            .container-home{
            display:flex;
            flex-direction:column;
            gap:70px;
            padding: 10vh 20px;
            }
            `;
        this.appendChild(style);
        this.listeners();
    }
}
customElements.define("home-page", Home);
