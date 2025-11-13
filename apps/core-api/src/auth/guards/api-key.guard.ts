import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      throw new UnauthorizedException("Missing API key");
    }

    // TODO: Validate against tenant's API keys in database
    const validKeys = this.config.get<string>("API_KEYS")?.split(",") || [];
    if (!validKeys.includes(apiKey)) {
      throw new UnauthorizedException("Invalid API key");
    }

    return true;
  }
}
