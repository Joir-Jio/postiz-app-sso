import {
  Controller,
  Get,
  Query,
  Res,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService as AuthChecker } from '@gitroom/helpers/auth/auth.service';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { User, Provider } from '@prisma/client';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';

interface DirectLoginQuery {
  token: string;
  redirect?: string;
}

@Controller()
export class DirectLoginController {
  private readonly logger = new Logger(DirectLoginController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly organizationService: OrganizationService
  ) {}

  @Get('direct-login')
  async handleDirectLogin(
    @Query() query: DirectLoginQuery,
    @Res() response: Response
  ): Promise<void> {
    try {
      if (!query.token) {
        return this.redirectToAuth(response, 'Missing token parameter');
      }

      // Validate JWT token
      const decoded = AuthChecker.verifyJWT(query.token) as any;
      if (!decoded || !decoded.userId) {
        return this.redirectToAuth(response, 'Invalid token');
      }

      // Check if user exists, if not create user and organization
      let user = await this.usersService.getUserById(decoded.userId);
      
      if (!user) {
        // Create user with organization using the correct signature
        const createUserDto: Omit<CreateOrgUserDto, 'providerToken'> & { providerId?: string } = {
          email: decoded.email || `${decoded.userId}@direct-login.com`,
          company: `${decoded.name || 'User'}'s Organization`,
          provider: Provider.GENERIC,
          providerId: decoded.userId,
          password: '', // Empty password for generic provider
        };

        const organization = await this.organizationService.createOrgAndUser(
          createUserDto,
          'direct-login',
          'direct-login-client'
        );
        
        user = organization.users[0].user;
        await this.usersService.activateUser(user.id);
      }

      // Generate new JWT with full user data
      const fullToken = AuthChecker.signJWT(user);

      // Set auth cookie
      response.cookie('auth', fullToken, {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: false,
        sameSite: 'lax' as const,
      });

      // Redirect to app
      const redirectUrl = query.redirect || '/launches';
      response.redirect(HttpStatus.FOUND, `${process.env.FRONTEND_URL}${redirectUrl}`);

    } catch (error) {
      return this.redirectToAuth(response, 'Authentication failed');
    }
  }

  private redirectToAuth(response: Response, error: string): void {
    const errorUrl = `${process.env.FRONTEND_URL}/auth?error=${encodeURIComponent(error)}`;
    response.redirect(HttpStatus.FOUND, errorUrl);
  }
}