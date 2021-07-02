import { config } from 'dotenv';
config();

import { server } from './share';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080/';

server.start().then();
