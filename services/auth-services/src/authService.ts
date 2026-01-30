import { AuthTokens } from "@shared/types";
import prisma from 


export class AuthService {
    private readonly jwtSecret: string;
    private readonly jwtExpiresIn: string;
    private readonly jwtRefreshExpiresIn: string;
    private readonly jwtRefreshSecret: string;
    private readonly bcryptSaltRounds: number;

    constructor(){
        this.jwtSecret = process.env.JWT_SECRET!;
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
        this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
        this.bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);


        if(!this.jwtSecret || !this.jwtRefreshSecret){
            throw new Error("JWT secrets must be defined in environment variables");
        }
    }

    async register(email: string, password: string): Promise<AuthTokens> {
        const existingUser = await prisma
    }
}