import { Request, Response } from 'express';
import winstonEnvLogger from 'winston-env-logger';

import { Account } from '../db';

import UserServices from '../services/UserServices';

import { respondWithSuccess, respondWithWarning } from '../util/httpResponse';

const getProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user: id } = req;

  try {
    const user: Account | null = await UserServices.findUserById(id);

    if (!user) respondWithWarning(res, 401, 'unauthorized', {});

    if (user) {
      const {
        bio: { mentorBio },
        profile: {
          account: { email, role },
          ...rest
        },
      } = user;

      respondWithSuccess(res, 200, 'User details', {
        email,
        role,
        mentorBio,
        ...rest,
      });
    }
  } catch (error: any) {
    winstonEnvLogger.error({ message: 'An error occured', error });
    throw new Error(error);
  }
};

export default getProfileController;
