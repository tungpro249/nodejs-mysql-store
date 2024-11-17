import express from 'express';

const router = express.Router();

import commentRouter from './comment';
import userRouter from './user';
import categoryRouter from './categories';
import productRouter from './products';
import cartRouter from './cart';
import orderRouter from './order';
import loyalCustomerRouter from './loyalCustomer';
import brandRouter from './brands';
import homeRouter from './home';

router.use("/api/comments", commentRouter);
router.use("/api/auth", userRouter);
router.use("/api/categories", categoryRouter);
router.use("/api/products", productRouter);
router.use("/api/carts", cartRouter);
router.use("/api/orders", orderRouter);
router.use("/api/loyal", loyalCustomerRouter);
router.use("/api/brands", brandRouter);
router.use("/api", homeRouter);

export default router;
