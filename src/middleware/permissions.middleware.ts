import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../utils/requestType';

export const authorizeCategories = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "categories";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeProducts = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "products";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeUsers = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "users";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeRoles = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "roles";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeSales = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "sales";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeDashboard = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "dashboard";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeSuppliers = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "suppliers";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeCustomers = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "customers";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizePurchases = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "purchases";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_${resourceName}`;
      break;
    case "PUT":
      requiredPermission = `update_${resourceName}`;
      break;
    case "DELETE":
      requiredPermission = `delete_${resourceName}`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}

export const authorizeCashier = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let requiredPermission = "";
  const resourceName = "cashier";

  switch (req.method) {
    case "GET":
      requiredPermission = `read_${resourceName}`;
      break;
    case "POST":
      requiredPermission = `create_sales`;
      break;
  }

  const userPermissions = req.user.role.permissions;

  if (!userPermissions.includes(requiredPermission)) {
    return res.status(403).json({ error: "Anda tidak memiliki akses." });
  }

  // If the user has the required permission, proceed to the next middleware or route handler
  next();
}