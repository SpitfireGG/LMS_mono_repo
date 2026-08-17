import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";

@ApiTags("Users")
@Controller("api/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("admin")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: "List all users (admin)" })
  findAll(@Query("page") page?: number, @Query("limit") limit?: number) {
    return this.usersService.findAll(page, limit);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a user by ID (admin)" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }
}
