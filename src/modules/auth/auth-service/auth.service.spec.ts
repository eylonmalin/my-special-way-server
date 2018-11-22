import * as jwt from 'jsonwebtoken';

import { AuthServiceInterface } from './auth.service.interface';
import { AuthService } from './auth.service';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';
import { UserDbModel, UserRole } from '../../../models/user.db.model';
import { UserLoginRequest } from '../../../models/user-login-request.model';

describe('auth.service', () => {
  let authService: AuthServiceInterface;
  let userPersistanceServiceMock: Partial<UsersPersistenceService>;

  beforeEach(() => {
    userPersistanceServiceMock = {
      authenticateUser: jest.fn(),
      getUserByFilters: jest.fn(),
    };

    authService = new AuthService(userPersistanceServiceMock as UsersPersistenceService);
  });

  it('should create valid token if user was found in db', async () => {
    expect.hasAssertions();
    // given
    (userPersistanceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce([
      null,
      {
        username: 'mock user',
      } as UserDbModel,
    ]);

    // when
    const token = await authService.createTokenFromCridentials({} as UserLoginRequest);
    expect(token).toBeDefined();
  });

  it('should create unexpired token if user role is STUDENT', async () => {
    expect.hasAssertions();
    // given
    (userPersistanceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce([
      null,
      {
        username: 'mock user',
        role: UserRole.STUDENT,
      } as UserDbModel,
    ]);

    // when
    const token = (await authService.createTokenFromCridentials({} as UserLoginRequest))[1];
    const decodedToken: any = jwt.decode(token, { json: true });
    expect(decodedToken.exp).not.toBeDefined();
  });

  for (const role in UserRole) {
    if (role === UserRole.STUDENT) {
      continue;
    }
    it(`should create expired token if user role is ${role}`, async () => {
      expect.hasAssertions();

      // given
      (userPersistanceServiceMock.authenticateUser as jest.Mock).mockReturnValueOnce([
        null,
        {
          username: 'mock user',
          role,
        } as UserDbModel,
      ]);

      // when
      const token = (await authService.createTokenFromCridentials({} as UserLoginRequest))[1];
      const decodedToken: any = jwt.decode(token, { json: true });
      expect(decodedToken.exp).toBeDefined();
    });
  }
  it('should create valid token if user was found in db', async () => {
    expect.hasAssertions();
    // given
    const mockExp = new Date();
    mockExp.setDate(mockExp.getDate() + 1);
    (userPersistanceServiceMock.getUserByFilters as jest.Mock).mockReturnValueOnce({
      username: 'mock user',
      firstLoginData: { expiration: mockExp },
    });

    // when
    const token = await authService.createTokenFromFirstLoginToken('firstLoginToken');
    expect(token[0]).toBeNull();
    expect(token[1]).toBeDefined();
  });
  it('should no create valid token if the expiration is over', async () => {
    expect.hasAssertions();
    // given
    const mockExp = new Date();
    mockExp.setDate(mockExp.getDate() - 1);
    (userPersistanceServiceMock.getUserByFilters as jest.Mock).mockReturnValueOnce({
      username: 'mock user',
      firstLoginData: { expiration: mockExp },
    });

    // when
    const token = await authService.createTokenFromFirstLoginToken('firstLoginToken');
    expect(token[0]).toBeDefined();
    expect(token[1]).toBeNull();
  });
});
