"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarsRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
let StarsRepository = class StarsRepository {
    constructor(_github, _stars, _trending) {
        this._github = _github;
        this._stars = _stars;
        this._trending = _trending;
    }
    getGitHubRepositoriesByOrgId(org) {
        return this._github.model.gitHub.findMany({
            where: {
                organizationId: org,
            },
        });
    }
    replaceOrAddTrending(language, hashedNames, arr) {
        return this._trending.model.trending.upsert({
            create: {
                language,
                hash: hashedNames,
                trendingList: JSON.stringify(arr),
                date: new Date(),
            },
            update: {
                language,
                hash: hashedNames,
                trendingList: JSON.stringify(arr),
                date: new Date(),
            },
            where: {
                language,
            },
        });
    }
    getAllGitHubRepositories() {
        return this._github.model.gitHub.findMany({
            distinct: ['login'],
        });
    }
    async getLastStarsByLogin(login) {
        var _a;
        return (_a = (await this._stars.model.star.findMany({
            where: {
                login,
            },
            orderBy: {
                date: 'desc',
            },
            take: 1,
        }))) === null || _a === void 0 ? void 0 : _a[0];
    }
    async getStarsByLogin(login) {
        return this._stars.model.star.findMany({
            where: {
                login,
            },
            orderBy: {
                date: 'asc',
            },
        });
    }
    async getGitHubsByNames(names) {
        return this._github.model.gitHub.findMany({
            where: {
                login: {
                    in: names,
                },
            },
        });
    }
    findValidToken(login) {
        return this._github.model.gitHub.findFirst({
            where: {
                login,
            },
        });
    }
    createStars(login, totalNewsStars, totalStars, totalNewForks, totalForks, date) {
        return this._stars.model.star.upsert({
            create: {
                login,
                stars: totalNewsStars,
                forks: totalNewForks,
                totalForks,
                totalStars,
                date,
            },
            update: {
                stars: totalNewsStars,
                totalStars,
                forks: totalNewForks,
                totalForks,
            },
            where: {
                login_date: {
                    date,
                    login,
                },
            },
        });
    }
    getTrendingByLanguage(language) {
        return this._trending.model.trending.findUnique({
            where: {
                language,
            },
        });
    }
    getStarsFilter(githubs, starsFilter) {
        return this._stars.model.star.findMany({
            orderBy: {
                [starsFilter.key || 'date']: starsFilter.state || 'desc',
            },
            where: {
                login: {
                    in: githubs.filter((f) => f),
                },
            },
            take: 20,
            skip: (starsFilter.page - 1) * 10,
        });
    }
    addGitHub(orgId, accessToken) {
        return this._github.model.gitHub.create({
            data: {
                token: accessToken,
                organizationId: orgId,
                jobId: '',
            },
        });
    }
    getGitHubById(orgId, id) {
        return this._github.model.gitHub.findUnique({
            where: {
                organizationId: orgId,
                id,
            },
        });
    }
    updateGitHubLogin(orgId, id, login) {
        return this._github.model.gitHub.update({
            where: {
                organizationId: orgId,
                id,
            },
            data: {
                login,
            },
        });
    }
    deleteRepository(orgId, id) {
        return this._github.model.gitHub.delete({
            where: {
                organizationId: orgId,
                id,
            },
        });
    }
    getOrganizationsByGitHubLogin(login) {
        return this._github.model.gitHub.findMany({
            select: {
                organizationId: true,
            },
            where: {
                login,
            },
            distinct: ['organizationId'],
        });
    }
};
exports.StarsRepository = StarsRepository;
exports.StarsRepository = StarsRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository])
], StarsRepository);
//# sourceMappingURL=stars.repository.js.map