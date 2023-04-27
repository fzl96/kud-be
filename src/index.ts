import express, { Express, Request, Response } from "express";
import cors from "cors";
import categoriesRoute from "./routes/categories.route";
import productsRoute from "./routes/products.route";
import usersRoute from "./routes/users.route";
import rolesRoute from "./routes/roles.route";
import customersRoute from "./routes/customers.route";
import salesRoute from "./routes/sales.route";
import purchasesRoute from "./routes/purchases.route";
import suppliersRoute from "./routes/suppliers.route";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
));
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/categories", categoriesRoute);
app.use("/products", productsRoute);
app.use("/users", usersRoute);
app.use("/roles", rolesRoute);
app.use("/customers", customersRoute);
app.use("/sales", salesRoute);
app.use("/purchases", purchasesRoute);
app.use("/suppliers", suppliersRoute);

app.listen(port, () =>
  console.log(`
🚀 Server ready at: http://localhost:${port}
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
