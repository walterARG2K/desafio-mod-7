class Card extends HTMLElement {
    petId: any;
    constructor() {
        super();
        this.render();
        this.petId = this.getAttribute("pet-id");
    }

    listeners() {
        this.shadowRoot?.querySelector(".report-info")?.addEventListener("click", () => {
            this.dispatchEvent(
                new CustomEvent("report", {
                    detail: {
                        petId: this.petId,
                    },
                    bubbles: true,
                })
            );
        });
    }

    render() {
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const containerCard = document.createElement("div");
        const pictureImg = document.createElement("img");
        const containerInfo = document.createElement("div");
        const containerName = document.createElement("div");
        const containerLocation = document.createElement("div");
        const containerReport = document.createElement("div");

        //styles for card
        style.textContent = `
        .card-container{
            display:flex;
            flex-direction:column;
            align-items:center;
            border:solid 2px #fff;
            width:331px;
            border-radius: 10px;
            box-shadow: 5px 2px 12px black;
            gap: 1.5px;
            padding-bottom: 3px;
        }

        .pet-picture{
            height:190px;
            width:331px;
            border-radius: 10px;
        }

        .container-info{
            display:flex;
            text-align:center;
            padding:0 20px;
            background-color: black;
            border-radius: 10px;
            width: 290px;
            justify-content:center;
        }

        .title, .paragraph{
            font-size:26px;
            margin:0px;
            color:#fff;
        }

        .paragraph{
            font-size:18px;
        }

        .container-report{
        margin:5px 0;
        }

        .container-name{
        width: 329px;
        text-align: center;
        background-color: #000;
        border-radius: 10px;
        }
        `;
        //adding attributes
        containerCard.classList.add("card-container");
        containerReport.classList.add("container-report");
        containerName.classList.add("container-name");
        containerInfo.classList.add("container-info");
        pictureImg.classList.add("pet-picture");
        pictureImg.setAttribute("src", this.getAttribute("url") || "");
        //content for containers
        containerName.innerHTML = `
        <h3 class="title">${this.getAttribute("nombre")}</h3>
        `;
        containerReport.innerHTML = `
                <p class="paragraph">${this.getAttribute("ubicacion")}</p>
        <a style="color:#3E91DD; text-decoration-line: underline; cursor:pointer;" class="report-info">${
            this.textContent
        }</a>
        `;
        //append childs
        containerCard.appendChild(containerName);
        containerCard.appendChild(pictureImg);
        containerInfo.appendChild(containerLocation);
        containerInfo.appendChild(containerReport);
        containerCard.appendChild(containerInfo);
        shadow.appendChild(containerCard);
        shadow.appendChild(style);

        this.listeners();
    }
}

customElements.define("card-custom", Card);
