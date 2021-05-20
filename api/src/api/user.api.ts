import { Resolver, Query, Authorized } from "type-graphql";
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
}