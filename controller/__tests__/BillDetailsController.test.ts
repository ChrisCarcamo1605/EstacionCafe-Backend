import { saveDetails, getDetails, deleteDetail, setService } from '../BillDetailsController';
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
    
    // Mock console methods to avoid test output pollution
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

    it('should handle any error when getting details', async () => {
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

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error en el servidor",
        errors: undefined // The controller accesses .error property which doesn't exist on zodError
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

  describe('deleteDetail', () => {
    it('should delete detail successfully', async () => {
      const mockReqWithParams = {
        ...mockReq,
        params: { id: '1' }
      };
      const mockResult = { affected: 1 };
      (mockService.delete as jest.Mock).mockResolvedValue(mockResult);

      await deleteDetail(mockReqWithParams, mockRes);

      expect(mockService.delete).toHaveBeenCalledWith('1');
      expect(mockRes.status).toHaveBeenCalledWith(202);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "sucess", // Note: typo in controller - "sucess" instead of "success"
        message: "Detalle eliminado correctamente"
      });
    });

    it('should handle ZodError when deleting detail', async () => {
      const mockReqWithParams = {
        ...mockReq,
        params: { id: 'invalid' }
      };
      const zodError = {
        name: 'ZodError',
        issues: [{
          message: 'Invalid ID format',
          path: ['id'],
          code: 'invalid_type'
        }]
      };
      (mockService.delete as jest.Mock).mockRejectedValue(zodError);

      await deleteDetail(mockReqWithParams, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "ID inválido: Invalid ID format"
      });
    });

    it('should handle not found error when deleting detail', async () => {
      const mockReqWithParams = {
        ...mockReq,
        params: { id: '999' }
      };
      const notFoundError = new Error('Detalle no encontrada');
      (mockService.delete as jest.Mock).mockRejectedValue(notFoundError);

      await deleteDetail(mockReqWithParams, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Detalle no encontrada"
      });
    });

    it('should handle server error when deleting detail', async () => {
      const mockReqWithParams = {
        ...mockReq,
        params: { id: '1' }
      };
      const serverError = new Error('Database connection failed');
      (mockService.delete as jest.Mock).mockRejectedValue(serverError);

      await deleteDetail(mockReqWithParams, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Error interno del servidor: Database connection failed"
      });
    });
  });

  describe('Edge Cases and Validations', () => {
    it('should handle empty request body in saveDetails', async () => {
      const emptyReq = { body: {} };
      const mockResult = { message: 'Saved with defaults' };
      (mockService.saveAll as jest.Mock).mockResolvedValue(mockResult);

      await saveDetails(emptyReq, mockRes);

      expect(mockService.saveAll).toHaveBeenCalledWith({});
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Factura y detalles guardados correctamente",
        data: mockResult
      });
    });

    it('should handle array of details in saveDetails', async () => {
      const multipleDetails = [
        { billId: 1, productId: 1, quantity: 2 },
        { billId: 1, productId: 2, quantity: 1 },
        { billId: 1, productId: 3, quantity: 3 }
      ];
      mockReq.body = multipleDetails;
      (mockService.saveAll as jest.Mock).mockResolvedValue(multipleDetails);

      await saveDetails(mockReq, mockRes);

      expect(mockService.saveAll).toHaveBeenCalledWith(multipleDetails);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('should handle null response from getAll', async () => {
      (mockService.getAll as jest.Mock).mockResolvedValue(null);

      await getDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "success",
        message: "Detalles obtenidos corretamente",
        data: null
      });
    });

    it('should handle numeric ID in deleteDetail', async () => {
      const mockReqWithNumericId = {
        ...mockReq,
        params: { id: 123 }
      };
      const mockResult = { affected: 1 };
      (mockService.delete as jest.Mock).mockResolvedValue(mockResult);

      await deleteDetail(mockReqWithNumericId, mockRes);

      expect(mockService.delete).toHaveBeenCalledWith(123);
      expect(mockRes.status).toHaveBeenCalledWith(202);
    });

    it('should handle error with nested error structure', async () => {
      const nestedError = {
        error: {
          message: 'Constraint violation',
          code: 'DB_ERROR'
        }
      };
      (mockService.getAll as jest.Mock).mockRejectedValue(nestedError);

      await getDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Hubo un error en el servidor",
        errors: {
          message: 'Constraint violation',
          code: 'DB_ERROR'
        }
      });
    });

    it('should handle ZodError with multiple issues in saveDetails', async () => {
      const multipleIssuesError = {
        name: 'ZodError',
        issues: [
          {
            message: 'Required field missing',
            path: ['billId'],
            code: 'invalid_type'
          },
          {
            message: 'Invalid quantity',
            path: ['quantity'],
            code: 'too_small'
          }
        ]
      };
      (mockService.saveAll as jest.Mock).mockRejectedValue(multipleIssuesError);

      await saveDetails(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.send).toHaveBeenCalledWith({
        status: "error",
        message: "Datos inválidos: Required field missing", // Takes first issue
        campo: ['billId'],
        error: 'invalid_type'
      });
    });
  });
});