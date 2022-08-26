import { User } from "./models/user";
import { Auth } from "./models/auth";
import { Pet } from "./models/pet";
import { Report } from "./models/report";
User.sync({ force: true });
Auth.sync({ force: true });
Pet.sync({ force: true });
Report.sync({ force: true });
