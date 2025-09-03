"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const stars_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/stars/stars.repository");
const lodash_1 = require("lodash");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const simple_statistics_1 = require("simple-statistics");
const client_1 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/client");
var Inform;
(function (Inform) {
    Inform[Inform["Removed"] = 0] = "Removed";
    Inform[Inform["New"] = 1] = "New";
    Inform[Inform["Changed"] = 2] = "Changed";
})(Inform || (Inform = {}));
let StarsService = class StarsService {
    constructor(_starsRepository, _notificationsService, _workerServiceProducer) {
        this._starsRepository = _starsRepository;
        this._notificationsService = _notificationsService;
        this._workerServiceProducer = _workerServiceProducer;
    }
    getGitHubRepositoriesByOrgId(org) {
        return this._starsRepository.getGitHubRepositoriesByOrgId(org);
    }
    getAllGitHubRepositories() {
        return this._starsRepository.getAllGitHubRepositories();
    }
    getStarsByLogin(login) {
        return this._starsRepository.getStarsByLogin(login);
    }
    getLastStarsByLogin(login) {
        return this._starsRepository.getLastStarsByLogin(login);
    }
    createStars(login, totalNewsStars, totalStars, totalNewForks, totalForks, date) {
        return this._starsRepository.createStars(login, totalNewsStars, totalStars, totalNewForks, totalForks, date);
    }
    async sync(login, token) {
        const loadAllStars = await this.syncProcess(login, token);
        const loadAllForks = await this.syncForksProcess(login, token);
        const allDates = [
            ...new Set([...Object.keys(loadAllStars), ...Object.keys(loadAllForks)]),
        ];
        const sortedArray = allDates.sort((a, b) => (0, dayjs_1.default)(a).unix() - (0, dayjs_1.default)(b).unix());
        let addPreviousStars = 0;
        let addPreviousForks = 0;
        for (const date of sortedArray) {
            const dateObject = (0, dayjs_1.default)(date).toDate();
            addPreviousStars += loadAllStars[date] || 0;
            addPreviousForks += loadAllForks[date] || 0;
            await this._starsRepository.createStars(login, loadAllStars[date] || 0, addPreviousStars, loadAllForks[date] || 0, addPreviousForks, dateObject);
        }
    }
    async findValidToken(login) {
        return this._starsRepository.findValidToken(login);
    }
    async fetchWillFallback(url, userToken) {
        if (userToken) {
            const response = await fetch(url, {
                headers: {
                    Accept: 'application/vnd.github.v3.star+json',
                    Authorization: `Bearer ${userToken}`,
                },
            });
            if (response.status === 200) {
                return response;
            }
        }
        const response2 = await fetch(url, {
            headers: Object.assign({ Accept: 'application/vnd.github.v3.star+json' }, (process.env.GITHUB_AUTH
                ? { Authorization: `token ${process.env.GITHUB_AUTH}` }
                : {})),
        });
        const totalRemaining = +(response2.headers.get('x-ratelimit-remaining') ||
            response2.headers.get('X-RateLimit-Remaining') ||
            0);
        const resetTime = +(response2.headers.get('x-ratelimit-reset') ||
            response2.headers.get('X-RateLimit-Reset') ||
            0);
        if (totalRemaining < 10) {
            console.log('waiting for the rate limit');
            const delay = resetTime * 1000 - Date.now() + 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.fetchWillFallback(url, userToken);
        }
        return response2;
    }
    async syncForksProcess(login, userToken, page = 1) {
        console.log('processing forks');
        const starsRequest = await this.fetchWillFallback(`https://api.github.com/repos/${login}/forks?page=${page}&per_page=100`, userToken);
        const data = await starsRequest.json();
        const mapDataToDate = (0, lodash_1.groupBy)(data, (p) => (0, dayjs_1.default)(p.created_at).format('YYYY-MM-DD'));
        const aggForks = Object.values(mapDataToDate).reduce((acc, value) => (Object.assign(Object.assign({}, acc), { [(0, dayjs_1.default)(value[0].created_at).format('YYYY-MM-DD')]: value.length })), {});
        const nextOne = data.length === 100
            ? await this.syncForksProcess(login, userToken, page + 1)
            : {};
        const allKeys = [
            ...new Set([...Object.keys(aggForks), ...Object.keys(nextOne)]),
        ];
        return Object.assign({}, allKeys.reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: (aggForks[key] || 0) + (nextOne[key] || 0) })), {}));
    }
    async syncProcess(login, userToken, page = 1) {
        console.log('processing stars');
        const starsRequest = await this.fetchWillFallback(`https://api.github.com/repos/${login}/stargazers?page=${page}&per_page=100`, userToken);
        const data = await starsRequest.json();
        const mapDataToDate = (0, lodash_1.groupBy)(data, (p) => (0, dayjs_1.default)(p.starred_at).format('YYYY-MM-DD'));
        const aggStars = Object.values(mapDataToDate).reduce((acc, value) => (Object.assign(Object.assign({}, acc), { [(0, dayjs_1.default)(value[0].starred_at).format('YYYY-MM-DD')]: value.length })), {});
        const nextOne = data.length === 100
            ? await this.syncProcess(login, userToken, page + 1)
            : {};
        const allKeys = [
            ...new Set([...Object.keys(aggStars), ...Object.keys(nextOne)]),
        ];
        return Object.assign({}, allKeys.reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: (aggStars[key] || 0) + (nextOne[key] || 0) })), {}));
    }
    async updateTrending(language, hash, arr) {
        const currentTrending = await this._starsRepository.getTrendingByLanguage(language);
        if ((currentTrending === null || currentTrending === void 0 ? void 0 : currentTrending.hash) === hash) {
            return;
        }
        if (currentTrending) {
            const list = JSON.parse(currentTrending.trendingList);
            const removedFromTrending = list.filter((p) => !arr.find((a) => a.name === p.name));
            const changedPosition = arr.filter((p) => {
                const current = list.find((a) => a.name === p.name);
                return current && current.position !== p.position;
            });
            if (removedFromTrending.length) {
                await this.inform(Inform.Removed, removedFromTrending, language);
            }
            if (changedPosition.length) {
                await this.inform(Inform.Changed, changedPosition, language);
            }
        }
        const informNewPeople = arr.filter((p) => {
            var _a;
            return !(currentTrending === null || currentTrending === void 0 ? void 0 : currentTrending.trendingList) ||
                ((_a = currentTrending === null || currentTrending === void 0 ? void 0 : currentTrending.trendingList) === null || _a === void 0 ? void 0 : _a.indexOf(p.name)) === -1;
        });
        await this.inform(Inform.New, informNewPeople, language);
        await this.replaceOrAddTrending(language, hash, arr);
    }
    async inform(type, removedFromTrending, language) {
        const names = await this._starsRepository.getGitHubsByNames(removedFromTrending.map((p) => p.name));
        const mapDbNamesToList = names.map((n) => removedFromTrending.find((p) => p.name === n.login));
        for (const person of mapDbNamesToList) {
            const getOrganizationsByGitHubLogin = await this._starsRepository.getOrganizationsByGitHubLogin(person.name);
            for (const org of getOrganizationsByGitHubLogin) {
                switch (type) {
                    case Inform.Removed:
                        return this._notificationsService.inAppNotification(org.organizationId, `${person.name} is not trending on GitHub anymore`, `${person.name} is not trending anymore in ${language}`, true);
                    case Inform.New:
                        return this._notificationsService.inAppNotification(org.organizationId, `${person.name} is trending on GitHub`, `${person.name} is trending in ${language || 'On the main feed'} position #${person.position}`, true);
                    case Inform.Changed:
                        return this._notificationsService.inAppNotification(org.organizationId, `${person.name} changed trending position on GitHub`, `${person.name} changed position in ${language || 'on the main feed to position'} position #${person.position}`, true);
                }
            }
        }
    }
    async replaceOrAddTrending(language, hash, arr) {
        return this._starsRepository.replaceOrAddTrending(language, hash, arr);
    }
    async getStars(org) {
        const getGitHubs = await this.getGitHubRepositoriesByOrgId(org);
        const list = [];
        for (const gitHub of getGitHubs) {
            if (!gitHub.login) {
                continue;
            }
            const getAllByLogin = await this.getStarsByLogin(gitHub.login);
            const stars = getAllByLogin.filter((f) => f.stars);
            const graphSize = stars.length < 10 ? stars.length : stars.length / 10;
            const forks = getAllByLogin.filter((f) => f.forks);
            const graphForkSize = forks.length < 10 ? forks.length : forks.length / 10;
            list.push({
                login: gitHub.login,
                stars: (0, lodash_1.chunk)(stars, graphSize).reduce((acc, chunkedStars) => {
                    return [
                        ...acc,
                        {
                            totalStars: chunkedStars[chunkedStars.length - 1].totalStars,
                            date: chunkedStars[chunkedStars.length - 1].date,
                        },
                    ];
                }, []),
                forks: (0, lodash_1.chunk)(forks, graphForkSize).reduce((acc, chunkedForks) => {
                    return [
                        ...acc,
                        {
                            totalForks: chunkedForks[chunkedForks.length - 1].totalForks,
                            date: chunkedForks[chunkedForks.length - 1].date,
                        },
                    ];
                }, []),
            });
        }
        return list;
    }
    async getStarsFilter(orgId, starsFilter) {
        const getGitHubs = await this.getGitHubRepositoriesByOrgId(orgId);
        if (getGitHubs.filter((f) => f.login).length === 0) {
            return [];
        }
        return this._starsRepository.getStarsFilter(getGitHubs.map((p) => p.login), starsFilter);
    }
    async addGitHub(orgId, code) {
        const { access_token } = await (await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: `${process.env.FRONTEND_URL}/settings`,
            }),
        })).json();
        return this._starsRepository.addGitHub(orgId, access_token);
    }
    async getOrganizations(orgId, id) {
        const getGitHub = await this._starsRepository.getGitHubById(orgId, id);
        return (await fetch(`https://api.github.com/user/orgs`, {
            headers: {
                Authorization: `token ${getGitHub === null || getGitHub === void 0 ? void 0 : getGitHub.token}`,
            },
        })).json();
    }
    async getRepositoriesOfOrganization(orgId, id, github) {
        const getGitHub = await this._starsRepository.getGitHubById(orgId, id);
        return (await fetch(`https://api.github.com/orgs/${github}/repos`, {
            headers: {
                Authorization: `token ${getGitHub === null || getGitHub === void 0 ? void 0 : getGitHub.token}`,
            },
        })).json();
    }
    async updateGitHubLogin(orgId, id, login) {
        const check = await fetch(`https://github.com/${login}`);
        if (check.status === 404) {
            throw new common_1.HttpException('GitHub repository not found!', 404);
        }
        this._workerServiceProducer
            .emit('sync_all_stars', { payload: { login } })
            .subscribe();
        return this._starsRepository.updateGitHubLogin(orgId, id, login);
    }
    async deleteRepository(orgId, id) {
        return this._starsRepository.deleteRepository(orgId, id);
    }
    async predictTrending(max = 500) {
        const firstDate = (0, dayjs_1.default)().subtract(1, 'day');
        return [
            firstDate.format('YYYY-MM-DDT12:00:00'),
            ...[...new Array(max)].map((p, index) => {
                return firstDate.add(index, 'day').format('YYYY-MM-DDT12:00:00');
            }),
        ];
    }
    async predictTrendingLoop(trendings, current = 0, max = 500) {
        const dates = trendings.map((result) => (0, dayjs_1.default)(result.date).toDate());
        const intervals = dates
            .slice(1)
            .map((date, i) => (date - dates[i]) / (1000 * 60 * 60 * 24));
        const nextInterval = intervals.length === 0 ? null : (0, simple_statistics_1.mean)(intervals);
        const lastTrendingDate = dates[dates.length - 1];
        const nextTrendingDate = !nextInterval
            ? false
            : (0, dayjs_1.default)(new Date(lastTrendingDate.getTime() + nextInterval * 24 * 60 * 60 * 1000)).toDate();
        if (!nextTrendingDate) {
            return [];
        }
        return [
            nextTrendingDate,
            ...(current < max
                ? await this.predictTrendingLoop([...trendings, { date: nextTrendingDate }], current + 1, max)
                : []),
        ];
    }
};
exports.StarsService = StarsService;
exports.StarsService = StarsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [stars_repository_1.StarsRepository,
        notification_service_1.NotificationService,
        client_1.BullMqClient])
], StarsService);
//# sourceMappingURL=stars.service.js.map