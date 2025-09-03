import { ItemUserRepository } from '@gitroom/nestjs-libraries/database/prisma/marketplace/item.user.repository';
export declare class ItemUserService {
    private _itemUserRepository;
    constructor(_itemUserRepository: ItemUserRepository);
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
