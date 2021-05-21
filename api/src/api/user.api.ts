import { nanoid } from "nanoid";
import { Resolver, Query, Authorized, Mutation, Arg } from "type-graphql";
import { getRepository, Repository } from "typeorm";

import { User } from "../entity/User";
import { Role } from "./auth.api";

@Resolver()
export class UserResolver {
    private rep: Repository<User>;

    constructor(){
        this.rep = getRepository(User);
    }

    @Authorized(Role.Common.Admin)
    @Query(() => [User])
    users() {
        return this.rep.find();
    }

    @Authorized(Role.Common.Admin)
    @Mutation(() => User)
    async activateUser(@Arg('id') userId: number) {
        let user = await this.rep.findOne(userId);
        if(!user){
            throw new Error('invalid_user_id')
        }

        user.isActive = true;
        user.token = user.token ? user.token : nanoid();

        await this.rep.save(user);

        return user;
    }
}