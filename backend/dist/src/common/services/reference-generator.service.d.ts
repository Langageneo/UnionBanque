import { PrismaService } from '../../prisma/prisma.service';
export declare class ReferenceGeneratorService {
    private prisma;
    constructor(prisma: PrismaService);
    generate(): Promise<string>;
}
