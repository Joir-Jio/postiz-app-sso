import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
export declare class ItemUserRepository {
    private _itemUser;
    constructor(_itemUser: PrismaRepository<'itemUser'>);
    addOrRemoveItem(add: boolean, userId: string, item: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload> | import(".prisma/client").Prisma.Prisma__ItemUserClient<{
        id: string;
        userId: string;
        key: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getItems(userId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        userId: string;
        key: string;
    }[]>;
}
