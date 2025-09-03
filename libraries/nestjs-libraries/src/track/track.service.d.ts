import { TrackEnum } from '@gitroom/nestjs-libraries/user/track.enum';
import { User } from '@prisma/client';
export declare class TrackService {
    private hashValue;
    track(uniqueId: string, ip: string, agent: string, tt: TrackEnum, additional: Record<string, any>, fbclid?: string, user?: User): Promise<import("facebook-nodejs-business-sdk").EventResponse>;
}
