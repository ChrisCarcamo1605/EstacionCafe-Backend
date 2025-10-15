"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTypeService = void 0;
const UserType_1 = require("../../domain/entities/UserType");
class UserTypeService {
    constructor(typeRepository) {
        this.typeRepo = typeRepository;
    }
    save(body) {
        const type = new UserType_1.UserType();
        type.name = body.name;
        type.permissionLevel = body.permissionLevel;
        console.log("Guardando tipo de usuario...");
        return this.typeRepo.save(type);
    }
    saveAll(body) {
        throw new Error("Method not implemented.");
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    update(body) {
        throw new Error("Method not implemented.");
    }
    getAll() {
        console.log(`Obteniendo tipos de usuarios...`);
        return this.typeRepo.find();
    }
}
exports.UserTypeService = UserTypeService;
