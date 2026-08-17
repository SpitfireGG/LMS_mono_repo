import {
  Controller,
  Post,
  Get,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { Response } from "express";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { randomUUID } from "crypto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Public } from "../common/decorators/public.decorator";
import * as fs from "fs";

const UPLOAD_DIR = join(process.cwd(), "uploads");

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

@ApiTags("Uploads")
@Controller("api/uploads")
export class UploadsController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload a file (admin)" })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp|svg|pdf)$/i;
        if (!allowed.test(extname(file.originalname))) {
          return cb(new BadRequestException("Invalid file type"), false);
        }
        cb(null, true);
      },
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file uploaded");
    return {
      url: `/api/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
    };
  }

  @Public()
  @Get(":filename")
  @ApiOperation({ summary: "Serve an uploaded file" })
  serveFile(@Param("filename") filename: string, @Res() res: Response) {
    const filePath = join(UPLOAD_DIR, filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException("File not found");
    }
    res.sendFile(filePath);
  }
}
