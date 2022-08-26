export function animationButton() {
    return `button {
     font-size: 1.5em;
     width: 200px;
     cursor: pointer;
     border: 0px;
     position: relative;
     transition: all .25s ease;
     overflow: hidden;
     border-radius: 10px
 }

 .load {
     position: absolute;
     left: 0px;
     top: 0px;
     width: 100%;
     height: 100%;
     background: inherit;
     display: flex;
     align-items: center;
     justify-content: center;
     border-radius: inherit
 }

 .load::after {
     content: '';
     position: absolute;
     border-radius: 50%;
     border: 3px solid #fff;
     width: 30px;
     height: 30px;
     border-left: 3px solid transparent;
     border-bottom: 3px solid transparent;
     animation: loading1 1s ease infinite;
     z-index: 10
 }

 .load::before {
     content: '';
     position: absolute;
     border-radius: 50%;
     border: 3px dashed #fff;
     width: 30px;
     height: 30px;
     border-left: 3px solid transparent;
     border-bottom: 3px solid transparent;
     animation: loading1 2s linear infinite;
     z-index: 5
 }

 @keyframes loading1 {
     0% {
         transform: rotate(0deg)
     }

     100% {
         transform: rotate(360deg)
     }
 }

 button.active {
     transform: scale(.85)
 }

 button.activeLoading .loading {
     visibility: visible;
     opacity: 1
 }

 button .loading {
     opacity: 0;
     visibility: hidden
 }`;
}
