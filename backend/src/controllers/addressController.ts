import { Request, Response, NextFunction } from 'express';
import { addressService } from '../services/addressService.js';
import { sendSuccess, sendError } from '../utils/response.js';

export async function getAddresses(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const addresses = await addressService.getUserAddresses(req.user.id);
    return sendSuccess(res, addresses, 'Addresses fetched successfully');
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const address = await addressService.createAddress(req.user.id, req.body);
    return sendSuccess(res, address, 'Address added successfully', 201);
  } catch (error: any) {
    if (error.message?.includes('required') || error.message?.includes('valid')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function updateAddress(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const addressId = String(req.params.id);
    const updated = await addressService.updateAddress(req.user.id, addressId, req.body);
    return sendSuccess(res, updated, 'Address updated successfully');
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    if (error.message?.includes('valid')) {
      return sendError(res, error.message, 400);
    }
    next(error);
  }
}

export async function deleteAddress(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const addressId = String(req.params.id);
    await addressService.deleteAddress(req.user.id, addressId);
    return sendSuccess(res, { id: addressId }, 'Address deleted successfully');
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}

export async function setDefaultAddress(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const addressId = String(req.params.id);
    const updated = await addressService.setDefaultAddress(req.user.id, addressId);
    return sendSuccess(res, updated, 'Default address updated successfully');
  } catch (error: any) {
    if (error.message?.includes('not found')) {
      return sendError(res, error.message, 404);
    }
    next(error);
  }
}
