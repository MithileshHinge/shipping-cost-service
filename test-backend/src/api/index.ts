import { SERVER_CONFIG } from '../config';
import app from './server';

app.listen(SERVER_CONFIG.PORT, () => console.log('app is running'));
