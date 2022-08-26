import { User } from "./user";
import { Auth } from "./auth";
import { Pet } from "./pet";
import { Report } from "./report";

User.hasMany(Pet);
Pet.belongsTo(User);

export { User, Pet, Auth, Report };
