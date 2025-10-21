import { saveDetails, getDetails, setService } from '../BillDetailsController';
import { IService } from '../../core/interfaces/IService';

// Mock service
const mockService: IService = {
  saveAll: jest.fn(),
  getAll: jest.fn(),
  save: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Mock request and response objects
const mockReq = {
  body: {}
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn()
};

describe('BillDetailsController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setService(mockService);
  });

  describe('saveDetails', () => {
    it('should save details successfully', async () => {
      const mockData = { billId: 1, productId: 1, quantity: 2 };
      mockReq.body = mockData;
      (mockService.saveAll as jest.Mock).mockResolvedValue(mockData);

      await saveDetails(mockReq, mockRes);

      expect(mockService.saveAll).toHaveBeenCalledWith(mockData);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Factura y detalles guardados correctamente",
        data: mockData
      });
    });

    it('should handle ZodError validation', async () => {
      const zodError = {
        name: 'ZodError',
        issues: [{
          message: 'Required field missing',
          path: ['billId'],
          code: 'invalid_type'
        }]
      };
      (mockService.saveAll as jest.Mock).mockRejectedValue(zodError);

      await saveDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Required field missing",
        campo: ['billId'],
        error: 'invalid_type'
      });
    });

    it('should handle server error', async () => {
      const serverError = new Error('Database connection failed');
      (mockService.saveAll as jest.Mock).mockRejectedValue(serverError);

      await saveDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo en error en el servidor al guardar el detalle",
        errors: serverError
      });
    });
  });

  describe('getDetails', () => {
    it('should get all details successfully', async () => {
      const mockDetails = [
        { id: 1, billId: 1, productId: 1, quantity: 2 },
        { id: 2, billId: 1, productId: 2, quantity: 1 }
      ];
      (mockService.getAll as jest.Mock).mockResolvedValue(mockDetails);

      await getDetails(mockReq, mockRes);

      expect(mockService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Detalles obtenidos corretamente",
        data: mockDetails
      });
    });

    it('should handle ZodError when getting details', async () => {
      const zodError = {
        name: 'ZodError',
        issues: [{
          message: 'Invalid data format',
          path: ['id'],
          code: 'invalid_type'
        }]
      };
      (mockService.getAll as jest.Mock).mockRejectedValue(zodError);

      await getDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Invalid data format",
        campo: ['id'],
        error: 'invalid_type'
      });
    });

    it('should handle server error when getting details', async () => {
      const serverError = { error: 'Database error' };
      (mockService.getAll as jest.Mock).mockRejectedValue(serverError);

      await getDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error en el servidor",
        errors: 'Database error'
      });
    });
  });
});