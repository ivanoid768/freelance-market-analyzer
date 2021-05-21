import { nanoid } from "nanoid";
import { Resolver, Query, Authorized, Mutation, InputType, Field, Args, ArgsType } from "type-graphql";
import { getRepository, Repository } from "typeorm";

import { Admin } from "../entity/Admin";

@ArgsType()
class LoginInput {
    @Field()
    login: string;

    @Field()
    password: string;
}

@Resolver()
export class AdminResolver {
    private rep: Repository<Admin>;

    constructor() {
        this.rep = getRepository(Admin);
    }

    @Mutation(() => Admin)
    async loginAdmin(@Args() loginData: LoginInput) {
        let admin = await this.rep.findOne({ where: { login: loginData.login } });
        if(!admin){
            throw new Error('invalid_login');
        }

        let passIsValid = await admin.comparePassword(loginData.password);
        if(!passIsValid){
            throw new Error('invalid_password');
        }

        admin.token = nanoid();
        admin = await this.rep.save(admin);

        // delete admin.password;

        return admin;
    }
}