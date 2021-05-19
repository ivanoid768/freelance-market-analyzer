import { Resolver, Query } from "type-graphql";
import { getRepository, Repository } from "typeorm";

import { User } from "../entity/User";

@Resolver()
export class UserResolver {
    private rep: Repository<User>;

    constructor(){
        this.rep = getRepository(User);
    }

    @Query(() => [User])
    users() {
        return this.rep.find();
    }
}