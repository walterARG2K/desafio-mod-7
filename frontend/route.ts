import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
    {
        path: "/inicio",
        component: "home-page",
    },
    {
        path: "/",
        component: "home-page",
    },
    {
        path: "/mis-datos",
        component: "my-info",
    },
    {
        path: "/mis-mascotas-reportadas",
        component: "pets-reported",
    },
    {
        path: "/mis-mascotas-reportadas/editar",
        component: "edit-pet",
    },
    {
        path: "/reportar-mascota",
        component: "report-pet",
    },
    {
        path: "/iniciar-sesion",
        component: "session-page",
    },
    {
        path: "/registrarse",
        component: "signup-page",
    },
]);
