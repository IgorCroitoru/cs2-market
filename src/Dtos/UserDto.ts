import { User } from "src/users/users.model";

export class UserDto{
    id: number;
    steamId64: string;
    first_join: Date;
    email?: string
    avatar?:string
    constructor(user:User){
        this.id = user.userId
        this.steamId64 = user.steamId64
        this.first_join = user.createdAt
        this.email = user.email
        this.avatar = user.avatar
    }
}