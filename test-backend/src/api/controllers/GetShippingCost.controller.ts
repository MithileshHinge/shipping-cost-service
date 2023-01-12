import { HTTPResponseCode } from '../HttpResponse';
import { calculateShipping } from '../useCases';
import handleControllerError from './handleControllerError';
import { IBaseController } from './IBaseController';

const getShippingCostController: IBaseController = async (httpRequest) => {
  try {
    const { src, dest, length, width, height, weight } = httpRequest.body;

    const cost = await calculateShipping.calculate(src, dest, { length, width, height, weight });

    return {
      statusCode: HTTPResponseCode.OK,
      body: cost,
    };
  } catch (err: any) {
    return handleControllerError(err);
  }
}

export default getShippingCostController;
