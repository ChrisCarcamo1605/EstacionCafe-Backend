import * as jwt from "jsonwebtoken";
import { loginUser } from "../../application/DTOs/UserDTO";
import { ITokenService } from "../../core/interfaces/ITokenService";
import { IService } from "../../core/interfaces/IService";
import { IUserService } from "../../core/interfaces/IUserService";
import * as bcrypt from "bcrypt";
import { error } from "console";
export class TokenService implements ITokenService {
  constructor(private userService: IUserService) {
    this.userService = userService;
  }

  private secret: string = process.env.JWT_SECRET || "secret";

  generateToken = async (payload: loginUser): Promise<string | null> => {
    try {
      const dbPassword = await this.userService.getPassword(payload.username);

      const isMath: boolean = await bcrypt.compare(
        payload.password,
        dbPassword!
      );

      if (!isMath) {
        console.log("Las contraseñas no coincidieron");
        throw error("Contraseña o usarname incorrecto");
      }
      console.log("Las contraseñas SI coincidieron");

      return jwt.sign(
        {
          email: payload.username,
          timestamp: Date.now(),
        },
        this.secret,
        {
          expiresIn: "1h",
        }
      );
    } catch (error: any) {
      return null;
    }
  };

  verifyToken = async (token: string): Promise<loginUser | null> => {
    try {
      const decodedPayload = jwt.verify(token, this.secret) as loginUser;
      console.log("\n--- Token Verificado Exitosamente ---");
      return decodedPayload;
    } catch (error: any) {
      console.log("\n--- Error de Verificación del Token ---");

      if (error instanceof jwt.TokenExpiredError) {
        console.error("Error: El token ha expirado.");
        throw new Error("Token expired");
      } else {
        console.error(
          "Error: El token no es válido o ha sido alterado.",
          error.message
        );
        throw new Error("Invalid token");
      }
    }
  };
}
