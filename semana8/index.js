import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';

import router from './routes/routers.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api', router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

