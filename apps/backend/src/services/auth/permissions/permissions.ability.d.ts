import { AuthorizationActions, Sections } from './permission.exception.class';
export declare const CHECK_POLICIES_KEY = "check_policy";
export type AbilityPolicy = [AuthorizationActions, Sections];
export declare const CheckPolicies: (...handlers: AbilityPolicy[]) => import("@nestjs/common").CustomDecorator<string>;
