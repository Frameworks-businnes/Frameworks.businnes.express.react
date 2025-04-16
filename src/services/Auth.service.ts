import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Enviroments } from '../plugins/Enviroments.service';
import { UserInterface } from '../interfaces/User.interface';

export interface TokenPayload {
    userId: number;
    email: string;
}

export class AuthService {
    
    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }

    static generateToken(payload: TokenPayload): string {
        // @ts-ignore
        return jwt.sign(payload, Enviroments.JWT_SECRET, {
            expiresIn: Enviroments.JWT_EXPIRES_IN
        });
    }

    static verifyToken(token: string): TokenPayload {
        try {
            // @ts-ignore
            const decoded = jwt.verify(token, Enviroments.JWT_SECRET);
            return decoded as TokenPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}