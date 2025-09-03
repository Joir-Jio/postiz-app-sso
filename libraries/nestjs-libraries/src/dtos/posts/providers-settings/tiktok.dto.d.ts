export declare class TikTokDto {
    title: string;
    privacy_level: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'FOLLOWER_OF_CREATOR' | 'SELF_ONLY';
    duet: boolean;
    stitch: boolean;
    comment: boolean;
    autoAddMusic: 'yes' | 'no';
    brand_content_toggle: boolean;
    video_made_with_ai: boolean;
    brand_organic_toggle: boolean;
    content_posting_method: 'DIRECT_POST' | 'UPLOAD';
}
