import { UserModel } from './user.model';

describe('UserModel', () => {
  it('should create an instance', () => {
    const instance: UserModel = {} as UserModel;
    expect(instance).toBeTruthy();
  });
});
