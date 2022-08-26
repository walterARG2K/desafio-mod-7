const state = {
    data: {},
    token: localStorage.getItem("token") || false,
    listeners: [], // los callbacks

    getState() {
        return this.data;
    },

    setState(newState) {
        this.data = newState;
        for (const callback of this.listeners) {
            callback();
        }
    },

    subscribe(callback: (any) => any) {
        this.listeners.push(callback);
        // recibe callbacks para ser avisados posteriormente
    },
    //obtiene todas las mascotas en un radio
    async getPetsLost(lat, lng) {
        const petsLost = await fetch(`/pet/search/location?lat=${lat}&lng=${lng}`);
        return await petsLost.json();
    },
    //verifica si el email ingresado coincide con una cuenta en el sitio
    async verifyEmailExists(email: string) {
        const existEmail = await fetch(`/user/verify-email?email=${email}`);
        return await existEmail.json();
    },
    //crea un nuevo usuario
    async createUser(userInfo) {
        const newUser = await fetch("/user", {
            method: "POST",
            body: JSON.stringify(userInfo),
            headers: {
                "Content-Type": "application/json",
            },
        });
        return true;
    },
    //inicia sesión y obtiene un token
    async login(email, password) {
        const tokenPromise = await fetch("/user/token", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (tokenPromise.status === 200) {
            const token = await tokenPromise.json();
            localStorage.setItem("token", token);
            this.token = token;
        }
        return await tokenPromise.status;
    },

    //cierra la sesión
    logout() {
        this.token = false;
        localStorage.removeItem("token");
    },

    //obtiene datos del usuario
    async getUser() {
        const token = localStorage.getItem("token");
        const user = await fetch("/user", {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        const email = await user.json();
        return email.userFind;
    },

    //actualiza los datos del usuario
    async updateInfoUser(infoUser) {
        const token = localStorage.getItem("token");
        const updatedInfo = await fetch("/user", {
            method: "PUT",
            body: JSON.stringify(infoUser),
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`,
            },
        });
        return await updatedInfo.json();
    },

    //crea un reporte de una mascota perdida
    async createPetReport(petInfo) {
        const token = localStorage.getItem("token");
        const newReport = await fetch("/pet", {
            method: "POST",
            body: JSON.stringify(petInfo),
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`,
            },
        });
        return await newReport.json();
    },

    //obtiene las mascotas reportadas por un usuario
    async getPetsReportedByUser() {
        const token = localStorage.getItem("token");
        const petsReported = await fetch("/pet", {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        return await petsReported.json();
    },

    //obtiene los datos de una mascota del usuario
    async getOnePet(petId) {
        const token = localStorage.getItem("token");
        const petsReported = await fetch("/pet/" + petId, {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        const response = await petsReported.json();
        return response;
    },

    //actualiza los datos de una mascota reportada
    async updateInfoPet(InfoPet, petId) {
        const token = localStorage.getItem("token");
        const updatedInfo = await fetch("/pet/" + petId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${token}`,
            },
            body: JSON.stringify(InfoPet),
        });
        return await updatedInfo.json();
    },
    async deletePet(petId) {
        const token = localStorage.getItem("token");
        const petDeleted = await fetch("/pet/" + petId, {
            method: "DELETE",
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        return await petDeleted.json();
    },

    //avisa al dueño de la mascota sobre nueva información
    async reportInfo(userId, petId, body) {
        const reportSend = await fetch(`/report?userId=${userId}&petId=${petId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        return await reportSend.json();
    },
};

export { state };
