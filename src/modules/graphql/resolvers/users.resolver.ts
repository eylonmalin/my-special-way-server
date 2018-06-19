import { Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserRole } from '../../../models/user.db.model';
import { UsersPersistenceService } from '../../persistence/users.persistence.service';

@Resolver('User')
export class UsersResolver {
    constructor(private usersPersistence: UsersPersistenceService) { }

    @Query('users')
    async getUsers() {
        return this.usersPersistence.getAll();
    }

    @Query('students')
    async getStudents() {
        return this.usersPersistence.getUserByRole(UserRole.STUDENT);
    }

    @Query('user')
    async getUserById(args) {
        return this.usersPersistence.getById(args.id);
    }

    @Mutation('addUser')
    async createUser(_, { user }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this.usersPersistence.createUser(user);
        return response;
    }

    @Mutation('updateUser')
    async updateUser(_, { id, user }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this.usersPersistence.updateUser(id, user);
        return response;
    }

    @Mutation('deleteUser')
    async deleteUser(_, { id }) {
        // TODO: Handle errors!!!!
        const [__, response] = await this.usersPersistence.deleteUser(id);
        return response;
    }
}