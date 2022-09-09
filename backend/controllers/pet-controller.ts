import { Pet } from "../models/pet";
import { cloudinary } from "../libs/cloudinary";
import { index } from "../libs/algolia";

export async function createPet(dataUrl, petInfo) {
    //sequelize(postgreSQL)
    const uploadedImage = await cloudinary.v2.uploader.upload(dataUrl);
    const pet = await Pet.create({ ...petInfo, urlImage: uploadedImage.url });

    //algolia
    await index
        .saveObject({
            objectID: pet.get("id"),
            _geoloc: {
                lat: pet.get("lat"),
                lng: pet.get("lng"),
            },
        })
        .catch((e) => console.log(e));
    return pet;
}

export async function getPets(userId) {
    //sequelize(postgreSQL)
    const petsFind = await Pet.findAll({
        where: {
            UserId: userId,
        },
    });
    return petsFind;
}

export async function getOnePet(petId) {
    //sequelize(postgreSQL)
    const pet = await Pet.findByPk(petId);
    return pet;
}

export async function getPetsByLocation(coords) {
    //algolia
    const { lat, lng } = coords;
    const petsByLocation = await index.search("", {
        aroundLatLng: [lat, lng].join(","),
        aroundRadius: 10000000,
    });
    const response: any = [];
    petsByLocation["hits"].forEach((i) => response.push(i.objectID));

    //sequelize(postgreSQL)
    const allPetsByLocation = await Pet.findAll({
        where: { id: response },
    });

    return allPetsByLocation;
}

export async function updatePet(petId, petInfo) {
    var petUpdate;
    //squelize(postgreSQL)
    if(petInfo.dataUrl){
    const uploadedImage = await cloudinary.v2.uploader.upload(petInfo.dataUrl);
    petUpdate = await Pet.update({...petInfo, urlImage:uploadedImage.url}, {
        where: {
            id: petId,
        },
    });
    }else{
    
    petUpdate = await Pet.update(petInfo, {
        where: {
            id: petId,
        },
    });
    }
    

    //algolia
    const response: any = {
        objectID: petId,
    };
    for (const field in petInfo) {
        if (petInfo[field]) response[field] = petInfo[field];
    }
    if (response.lat) {
        response["_geoloc"] = { lat: response.lat, lng: response.lng };
        delete response.lat;
        delete response.lng;
    }

    await index.partialUpdateObject(response).catch((e) => console.log(e));
    return petUpdate;
}

export async function deletePet(userId, petId) {
    //sequelize(postgreSQL)
    const petDelete = await Pet.destroy({
        where: {
            id: petId,
            UserId: userId,
        },
    });
    return petDelete;
}
