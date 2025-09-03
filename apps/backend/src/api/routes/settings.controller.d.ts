import { Organization } from '@prisma/client';
import { StarsService } from '@gitroom/nestjs-libraries/database/prisma/stars/stars.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { AddTeamMemberDto } from '@gitroom/nestjs-libraries/dtos/settings/add.team.member.dto';
export declare class SettingsController {
    private _starsService;
    private _organizationService;
    constructor(_starsService: StarsService, _organizationService: OrganizationService);
    getConnectedGithubAccounts(org: Organization): Promise<{
        github: {
            id: string;
            login: string;
        }[];
    }>;
    addGitHub(org: Organization, code: string): Promise<void>;
    authUrl(): {
        url: string;
    };
    getOrganizations(org: Organization, id: string): Promise<{
        organizations: any;
    }>;
    getRepositories(org: Organization, id: string, github: string): Promise<{
        repositories: any;
    }>;
    updateGitHubLogin(org: Organization, id: string, login: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }>;
    deleteRepository(org: Organization, id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }>;
    getTeam(org: Organization): Promise<{
        users: {
            user: {
                id: string;
                email: string;
            };
            role: import(".prisma/client").$Enums.Role;
        }[];
    }>;
    inviteTeamMember(org: Organization, body: AddTeamMemberDto): Promise<{
        url: string;
    }>;
    deleteTeamMember(org: Organization, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        disabled: boolean;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
