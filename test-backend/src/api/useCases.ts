import Cache from '../cache/Cache';
import CalculateShipping from '../CalculateShipping';
import DataAccess from '../db/DataAccess';
import EasyShip from './services/easyShip.service';

const dataAccess = new DataAccess();
const easyShip = new EasyShip();
const cache = new Cache();

export const calculateShipping = new CalculateShipping(dataAccess, easyShip, cache);
