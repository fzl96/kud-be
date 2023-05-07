import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import categoriesRoute from "./routes/categories.route";
import productsRoute from "./routes/products.route";
import usersRoute from "./routes/users.route";
import rolesRoute from "./routes/roles.route";
import customersRoute from "./routes/customers.route";
import salesRoute from "./routes/sales.route";
import purchasesRoute from "./routes/purchases.route";
import suppliersRoute from "./routes/suppliers.route";
import authRoute from "./routes/auth.route";
import cashierRoute from "./routes/cashier.route";
import { getSalesData } from "./controllers/dashboard.controller";
import { authenticateToken } from "./middleware/auth.middleware";
import { 
  authorizeCategories,
  authorizeProducts,
  authorizeUsers,
  authorizeRoles,
  authorizeSales,
  authorizeDashboard,
  authorizeCustomers,
  authorizeSuppliers,
  authorizePurchases,
  authorizeCashier,
} from "./middleware/permissions.middleware";


const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(cors(
  {
    credentials: true,
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
));
app.get("/", authenticateToken, (req: any, res: Response) => {
  res.json(req.user)
});

app.get("/dashboard/:year", authenticateToken, authorizeDashboard, getSalesData);
app.use("/auth", authRoute);
app.use("/categories", authenticateToken, authorizeCategories, categoriesRoute);
app.use("/products", authenticateToken, authorizeProducts, productsRoute);
app.use("/users", authenticateToken, authorizeUsers, usersRoute);
app.use("/roles", authenticateToken, authorizeRoles, rolesRoute);
app.use("/customers", authenticateToken, authorizeCustomers, customersRoute);
app.use("/sales", authenticateToken, authorizeSales, salesRoute);
app.use("/purchases", authenticateToken, authorizePurchases, purchasesRoute);
app.use("/suppliers", authenticateToken, authorizeSuppliers, suppliersRoute); 
app.use('/cashier', authenticateToken, authorizeCashier, cashierRoute);

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
