class Check extends HTMLElement {
    constructor() {
        super();
        this.render();
    }
    render() {
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        const container = document.createElement("div");
        const containerCheck = document.createElement("div");
        const textEl = document.createElement("p");
        //styles
        style.textContent = `
@keyframes checkmark {
    0% {
        stroke-dashoffset: 50px
    }

    100% {
        stroke-dashoffset: 0
    }
}
@keyframes checkmark-circle {
    0% {
        stroke-dashoffset: 240px
    }

    100% {
        stroke-dashoffset: 480px
    }
}
.icon--order-success svg path {
    -webkit-animation: checkmark 0.25s ease-in-out 1s backwards;

}
.icon--order-success svg circle {
    -webkit-animation: checkmark-circle 1s ease-in-out backwards;

}


.container{
    width: 60vw;
    max-width: 290px;
    transform: translate(-50%, -50%);
    height: 27vh;
    background-color: black;
    align-items: center;
    display: flex;
    flex-direction:column;
    border-radius: 30px;
    padding: 20px;
    justify-content: center;
	animation: scale-up-bottom 0.7s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

.text{
    color: #fff;
    text-align: center;
    background-color: green;
    border-radius: 11px;
}
@keyframes scale-up-bottom {
  0% {
            transform: scale(0.5);
            transform-origin: 50% 100%;
  }
  100% {
            transform: scale(1);
            transform-origin: 50% 100%;
  }
}


        `;
        //adding attributes
        containerCheck.classList.add("container-check");
        textEl.classList.add("text");
        container.classList.add("container");
        //content check
        containerCheck.innerHTML = `
    <div class="success-checkmark">
        <div class="check-icon">
            <div class="icon icon--order-success svg">
                <svg xmlns="http://www.w3.org/2000/svg" width="72px" height="72px">
                    <g fill="none" stroke="#8EC343" stroke-width="2">
                        <circle cx="36" cy="36" r="35" style="stroke-dasharray:240px, 240px; stroke-dashoffset: 480px;"></circle>
                        <path d="M17.417,37.778l9.93,9.909l25.444-25.393" style="stroke-dasharray:50px, 50px; stroke-dashoffset: 0px;"></path>
                    </g>
                </svg>
            </div>
        </div>
    </div>
        `;

        //content text
        textEl.textContent = this.textContent;

        //append childs
        container.appendChild(textEl);
        container.appendChild(containerCheck);
        shadow.appendChild(container);
        shadow.appendChild(style);
    }
}

customElements.define("check-custom", Check);
