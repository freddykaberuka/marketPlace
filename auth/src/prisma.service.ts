import {
  Global,
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from ".prisma/client";
import * as bcrypt from "bcryptjs";
import { ERole } from "./auth/enums/role.enum";
import { IConstants } from "./_shared/interfaces/constants.interface";
import { EStatus } from "./auth/enums/status.enum";

@Injectable()
@Global()
export class PrismaService extends PrismaClient implements OnModuleInit {
  schoolId: string;
  parentId: string;
  constructor(private readonly configService: ConfigService<IConstants>) {
    super({
      datasources: {
        db: { url: configService.get("databaseUrl") },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
  /**
   * Apply middleware to prisma for delete, find,...
   * @param prismaService [PrismaService]
   */
  applyPrismaMiddleware() {
    this.$use(async (params, next) => {
      // SET deletedAt when deleting
      if (params.action == "delete") {
        params.action = "update";
        params.args["data"] = { deletedAt: new Date() };
      }
      if (params.action == "deleteMany") {
        params.action = "updateMany";
        if (params.args.data != undefined) {
          params.args.data["deletedAt"] = new Date();
        } else {
          params.args["data"] = { deletedAt: new Date() };
        }
      }

      // Ignore records with deletedAt when updating
      if (params.action == "update") {
        params.action = "updateMany";
        params.args.where["deletedAt"] = null;
      }
      if (params.action == "updateMany") {
        if (params.args.where != undefined) {
          params.args.where["deletedAt"] = null;
        } else {
          params.args["where"] = { deletedAt: null };
        }
      }

      // Ignore records with deletedAt when finding
      if (params.action === "findUnique" || params.action === "findFirst") {
        params.action = "findFirst";
        params.args.where["deletedAt"] = null;
      }
      if (params.action === "findMany" || params.action === "count") {
        if (params.args.where) {
          if (params.args.where.deletedAt == undefined) {
            params.args.where["deletedAt"] = null;
          }
        } else {
          params.args["where"] = { deletedAt: null };
        }
      }
      return next(params);
    });
  }

  /**
   * Run database seeds
   */
  async seed() {
    Logger.debug(`Start seeding...`);
    await this.seedAdmin();
    Logger.debug(`Seeding finished.`);
  }

  /**
   * Seed the admin
   */
  private async seedAdmin() {
    if (!(await this.user.count({ where: { role: ERole.ADMIN } }))) {
      await this.user.create({
        data: {
          username: "Test",
          email: this.configService.get("adminEmail"),
          password: bcrypt.hashSync(
            this.configService.get("adminPassword"),
            10,
          ),
          role: ERole.ADMIN,
          status: EStatus.VERIFIED,
        },
      });
    }
  }
}
