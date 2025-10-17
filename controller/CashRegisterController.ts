import { IService } from "../core/interfaces/IService";
import { createCashRegisterSchema, updateCashRegisterSchema, cashRegisterIdSchema } from "../application/validations/CashRegisterValidations";
import { SaveCashRegisterDTO } from "../application/DTOs/CashRegisterDTO";

let service: IService | null = null;

export const setService = (cashRegisterService: IService) => {
    service = cashRegisterService;
};

const getService = () => {
    if (!service) {
        throw new Error("CashRegister service no está inicializado. Llama a setService primero.");
    }
    return service;
};

export const getCashRegisters = async (req: any, res: any) => {
    try {
        const currentService = getService();
        const data = await currentService.getAll();

        return res.status(200).send({ body: data });
    } catch (error: any) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener las cajas registradoras: ${error.message}`,
        });
    }
};

export const getCashRegisterById = async (req: any, res: any) => {
    try {
        const { id } = cashRegisterIdSchema.parse(req.params);
        const cashRegisterService = getService() as any;

        const data = await cashRegisterService.getById(id);

        return res.status(200).send({ body: data });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "ID inválido: " + error.issues[0].message,
            });
        }

        if (error.message.includes("no encontrada")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }

        return res.status(500).send({
            status: "error",
            message: `Error al obtener la caja registradora: ${error.message}`,
        });
    }
};

export const createCashRegister = async (req: any, res: any) => {
    try {
        const cashRegisterData: SaveCashRegisterDTO = req.body;
        const currentService = getService();
        const result = await currentService.save(createCashRegisterSchema.parse(cashRegisterData));

        return res.status(201).send({
            message: "Caja registradora creada correctamente",
            data: result,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "Datos inválidos: " + error.issues[0].message,
                campo: error.issues[0].path,
                error: error.issues[0].code,
            });
        }

        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
};

export const updateCashRegister = async (req: any, res: any) => {
    try {
        const { id } = cashRegisterIdSchema.parse(req.params);
        const updateData = updateCashRegisterSchema.parse(req.body);

        const cashRegisterService = getService() as any;
        const result = await cashRegisterService.update({
            cashRegisterId: parseInt(String(id)),
            ...updateData
        });

        return res.status(200).send({
            message: "Caja registradora actualizada correctamente",
            data: result,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "Datos inválidos: " + error.issues[0].message,
                campo: error.issues[0].path,
            });
        }

        if (error.message.includes("no encontrada")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }

        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
};

export const deleteCashRegister = async (req: any, res: any) => {
    try {
        const { id } = cashRegisterIdSchema.parse(req.params);

        const currentService = getService();
        const result = await currentService.delete(parseInt(String(id)));

        return res.status(200).send({
            message: "Caja registradora eliminada correctamente",
            data: result,
        });
    } catch (error: any) {
        if (error.name === "ZodError") {
            return res.status(400).send({
                status: "error",
                message: "ID inválido: " + error.issues[0].message,
            });
        }

        if (error.message.includes("no encontrada")) {
            return res.status(404).send({
                status: "error",
                message: error.message,
            });
        }

        return res.status(500).send({
            status: "error",
            message: `Error interno del servidor: ${error.message}`,
        });
    }
};

export const getActiveCashRegisters = async (req: any, res: any) => {
    try {
        const cashRegisterService = getService() as any;
        const data = await cashRegisterService.getActiveCashRegisters();

        return res.status(200).send({ body: data });
    } catch (error: any) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener las cajas registradoras activas: ${error.message}`,
        });
    }
};

export const getCashRegistersByNumber = async (req: any, res: any) => {
    try {
        const { number } = req.params;
        const cashRegisterService = getService() as any;

        const data = await cashRegisterService.getByNumber(number);

        return res.status(200).send({ body: data });
    } catch (error: any) {
        return res.status(500).send({
            status: "error",
            message: `Error al obtener las cajas registradoras por número: ${error.message}`,
        });
    }
};