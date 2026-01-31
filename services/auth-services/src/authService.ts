import { AuthTokens } from "@shared/types";
import prisma from "./database";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue} from "ms"


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
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if(existingUser){
            throw new Error("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, this.bcryptSaltRounds);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });

        return this.generateTokens(user.id, user.email);
    }

    private async generateTokens(userId: string, email: string): Promise<AuthTokens> {
        const payload = { userId, email };

       const accessTokenOptions: SignOptions = {
            expiresIn: this.jwtExpiresIn as StringValue
       }

       const accessToken = jwt.sign(payload, this.jwtSecret, accessTokenOptions);

       const refreshTokenOptions: SignOptions = {
            expiresIn: this.jwtRefreshExpiresIn as StringValue
       }

         const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, refreshTokenOptions);

         const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
        
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                expiresAt
            }
        });

        return {
            accessToken,
            refreshToken
        }
    }
}