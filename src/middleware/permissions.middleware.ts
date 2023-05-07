import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../utils/requestType';

export const authorizeCategories = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('categories')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeProducts = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('products')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeUsers = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('users')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeRoles = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('roles')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeSales = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('sales')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeReports = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('reports')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeDashboard = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('dashboard')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeSuppliers = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('suppliers')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeCustomers = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('customers')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizePurchases = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('purchases')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}

export const authorizeCashier = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user.role.permissions.includes('cashier')) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  next();
}