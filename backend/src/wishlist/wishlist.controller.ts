import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { WishlistService } from "./wishlist.service";
import { AddToWishlistDto, QueryWishlistDto } from "./dto/wishlist.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@ApiTags("Wishlist")
@Controller("api/wishlist")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: "List the courses on my wishlist" })
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryWishlistDto) {
    return this.wishlistService.findAll(user.id, query);
  }

  @Get("ids")
  @ApiOperation({ summary: "Course ids on my wishlist" })
  findIds(@CurrentUser() user: AuthUser) {
    return this.wishlistService.findIds(user.id);
  }

  @Post()
  @ApiOperation({ summary: "Add a course to my wishlist" })
  add(@CurrentUser() user: AuthUser, @Body() dto: AddToWishlistDto) {
    return this.wishlistService.add(user.id, dto.courseId);
  }

  @Delete("all")
  @ApiOperation({ summary: "Clear my wishlist" })
  clear(@CurrentUser() user: AuthUser) {
    return this.wishlistService.clear(user.id);
  }

  @Delete(":courseId")
  @ApiOperation({ summary: "Remove a course from my wishlist" })
  remove(@CurrentUser() user: AuthUser, @Param("courseId") courseId: string) {
    return this.wishlistService.remove(user.id, courseId);
  }
}
