import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { MockTestsService, Viewer } from "./mock-tests.service";
import {
  CreateMockTestDto,
  UpdateMockTestDto,
  QueryMockTestDto,
  CreateAttemptDto,
} from "./dto/mock-test.dto";
import {
  mediaDiskStorage,
  practiceUploadFields,
  practiceUploadOptions,
  recordingFilter,
  MAX_RECORDING_BYTES,
} from "./media.storage";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { OptionalJwtAuthGuard } from "../common/guards/optional-jwt-auth.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Public } from "../common/decorators/public.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";

type PracticeFiles = {
  pdf?: Express.Multer.File[];
  media?: Express.Multer.File[];
};

const pick = (files: PracticeFiles = {}) => ({
  pdf: files.pdf?.[0],
  media: files.media?.[0],
});

@ApiTags("Practice sessions")
@Controller("api/mock-tests")
export class MockTestsController {
  constructor(private readonly mockTests: MockTestsService) {}

  // ── Public catalogue ────────────────────────────────────────────

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "List published practice sessions" })
  findAll(@Query() query: QueryMockTestDto, @CurrentUser() viewer?: Viewer) {
    return this.mockTests.findAll(query, viewer);
  }

  @Public()
  @Get("facets")
  @ApiOperation({ summary: "Languages, categories and kinds currently available" })
  facets() {
    return this.mockTests.facets();
  }

  @Get("attempts/mine")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "My recordings" })
  myAttempts(@CurrentUser() viewer: Viewer, @Query("mockTestId") mockTestId?: string) {
    return this.mockTests.findMyAttempts(viewer, mockTestId);
  }

  @Get("admin/all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "List every practice session including drafts (admin)" })
  adminFindAll(@Query() query: QueryMockTestDto) {
    return this.mockTests.adminFindAll(query);
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get("slug/:slug")
  @ApiOperation({ summary: "Get one practice session by slug" })
  findBySlug(@Param("slug") slug: string, @CurrentUser() viewer?: Viewer) {
    return this.mockTests.findBySlug(slug, viewer);
  }

  // ── Admin authoring ─────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Create a practice session with its PDF and media (admin)" })
  @UseInterceptors(FileFieldsInterceptor(practiceUploadFields, practiceUploadOptions()))
  create(@Body() dto: CreateMockTestDto, @UploadedFiles() files: PracticeFiles) {
    return this.mockTests.create(dto, pick(files));
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Update a practice session, optionally replacing files (admin)" })
  @UseInterceptors(FileFieldsInterceptor(practiceUploadFields, practiceUploadOptions()))
  update(
    @Param("id") id: string,
    @Body() dto: UpdateMockTestDto,
    @UploadedFiles() files: PracticeFiles,
  ) {
    return this.mockTests.update(id, dto, pick(files));
  }

  // Declared before ":id" so the literal segment wins the match.
  @Delete("attempts/:attemptId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete one of my recordings" })
  removeAttempt(@CurrentUser() viewer: Viewer, @Param("attemptId") attemptId: string) {
    return this.mockTests.removeAttempt(viewer, attemptId);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a practice session and its files (admin)" })
  remove(@Param("id") id: string) {
    return this.mockTests.remove(id);
  }

  // ── Candidate recordings ────────────────────────────────────────

  @Post(":id/attempts")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @ApiOperation({ summary: "Save a recording of my run at this session" })
  @UseInterceptors(
    FileInterceptor("recording", {
      storage: mediaDiskStorage(),
      limits: { fileSize: MAX_RECORDING_BYTES },
      fileFilter: recordingFilter,
    }),
  )
  createAttempt(
    @CurrentUser() viewer: Viewer,
    @Param("id") id: string,
    @Body() dto: CreateAttemptDto,
    @UploadedFile() recording: Express.Multer.File,
  ) {
    return this.mockTests.createAttempt(viewer, id, dto, recording);
  }
}
