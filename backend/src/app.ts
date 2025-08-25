import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoute from './routes/auth.route';
import categoryRoute from './routes/category.route';
import transactionsRoute from './routes/transaction.route';
import dashboardRoute from './routes/dashboard.route';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.set('trust proxy', 1);

app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoute);
app.use('/api/transaction', transactionsRoute);
app.use('/api/dashboard', dashboardRoute);
app.use((req, res) => {
  res.status(404).send('Route Not Found');
});
export { app };
