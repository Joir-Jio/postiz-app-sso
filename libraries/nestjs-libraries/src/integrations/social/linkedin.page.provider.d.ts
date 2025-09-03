import { AnalyticsData, AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { LinkedinProvider } from '@gitroom/nestjs-libraries/integrations/social/linkedin.provider';
import { Integration } from '@prisma/client';
export declare class LinkedinPageProvider extends LinkedinProvider implements SocialProvider {
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    refreshWait: boolean;
    maxConcurrentJob: number;
    scopes: string[];
    editor: "normal";
    refreshToken(refresh_token: string): Promise<AuthTokenDetails>;
    repostPostUsers(integration: Integration, originalIntegration: Integration, postId: string, information: any): Promise<void>;
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    companies(accessToken: string): Promise<any>;
    reConnect(id: string, requiredId: string, accessToken: string): Promise<AuthTokenDetails>;
    fetchPageInformation(accessToken: string, pageId: string): Promise<{
        id: any;
        name: any;
        access_token: string;
        picture: any;
        username: any;
    }>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
        refresh?: string;
    }): Promise<{
        id: string;
        accessToken: any;
        refreshToken: any;
        expiresIn: any;
        name: any;
        picture: any;
        username: any;
    }>;
    post(id: string, accessToken: string, postDetails: PostDetails[], integration: Integration): Promise<PostResponse[]>;
    analytics(id: string, accessToken: string, date: number): Promise<AnalyticsData[]>;
    autoRepostPost(integration: Integration, id: string, fields: {
        likesAmount: string;
    }): Promise<boolean>;
    autoPlugPost(integration: Integration, id: string, fields: {
        likesAmount: string;
        post: string;
    }): Promise<boolean>;
}
export interface Root {
    pageStatisticsByIndustryV2: any[];
    pageStatisticsBySeniority: any[];
    organization: string;
    pageStatisticsByGeoCountry: any[];
    pageStatisticsByTargetedContent: any[];
    totalPageStatistics: TotalPageStatistics;
    pageStatisticsByStaffCountRange: any[];
    pageStatisticsByFunction: any[];
    pageStatisticsByGeo: any[];
    followerGains: {
        organicFollowerGain: number;
        paidFollowerGain: number;
    };
    timeRange: TimeRange;
    totalShareStatistics: {
        uniqueImpressionsCount: number;
        shareCount: number;
        engagement: number;
        clickCount: number;
        likeCount: number;
        impressionCount: number;
        commentCount: number;
    };
}
export interface TotalPageStatistics {
    clicks: Clicks;
    views: Views;
}
export interface Clicks {
    mobileCustomButtonClickCounts: any[];
    desktopCustomButtonClickCounts: any[];
}
export interface Views {
    mobileProductsPageViews: MobileProductsPageViews;
    allDesktopPageViews: AllDesktopPageViews;
    insightsPageViews: InsightsPageViews;
    mobileAboutPageViews: MobileAboutPageViews;
    allMobilePageViews: AllMobilePageViews;
    productsPageViews: ProductsPageViews;
    desktopProductsPageViews: DesktopProductsPageViews;
    jobsPageViews: JobsPageViews;
    peoplePageViews: PeoplePageViews;
    overviewPageViews: OverviewPageViews;
    mobileOverviewPageViews: MobileOverviewPageViews;
    lifeAtPageViews: LifeAtPageViews;
    desktopOverviewPageViews: DesktopOverviewPageViews;
    mobileCareersPageViews: MobileCareersPageViews;
    allPageViews: AllPageViews;
    careersPageViews: CareersPageViews;
    mobileJobsPageViews: MobileJobsPageViews;
    mobileLifeAtPageViews: MobileLifeAtPageViews;
    desktopJobsPageViews: DesktopJobsPageViews;
    desktopPeoplePageViews: DesktopPeoplePageViews;
    aboutPageViews: AboutPageViews;
    desktopAboutPageViews: DesktopAboutPageViews;
    mobilePeoplePageViews: MobilePeoplePageViews;
    desktopCareersPageViews: DesktopCareersPageViews;
    desktopInsightsPageViews: DesktopInsightsPageViews;
    desktopLifeAtPageViews: DesktopLifeAtPageViews;
    mobileInsightsPageViews: MobileInsightsPageViews;
}
export interface MobileProductsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface AllDesktopPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface InsightsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface MobileAboutPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface AllMobilePageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface ProductsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopProductsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface JobsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface PeoplePageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface OverviewPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface MobileOverviewPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface LifeAtPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopOverviewPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface MobileCareersPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface AllPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface CareersPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface MobileJobsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface MobileLifeAtPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopJobsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopPeoplePageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface AboutPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopAboutPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface MobilePeoplePageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopCareersPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopInsightsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface DesktopLifeAtPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface MobileInsightsPageViews {
    pageViews: number;
    uniquePageViews: number;
}
export interface TimeRange {
    start: number;
    end: number;
}
