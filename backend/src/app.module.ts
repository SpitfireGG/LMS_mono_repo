import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { ThrottlerModule } from "@nestjs/throttler";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { CoursesModule } from "./courses/courses.module";
import { ContactsModule } from "./contacts/contacts.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { TestimonialsModule } from "./testimonials/testimonials.module";
import { BlogPostsModule } from "./blog-posts/blog-posts.module";
import { TeamMembersModule } from "./team-members/team-members.module";
import { ServicesModule } from "./services/services.module";
import { FAQsModule } from "./faqs/faqs.module";
import { CaseStudiesModule } from "./case-studies/case-studies.module";
import { AnnouncementsModule } from "./announcements/announcements.module";
import { UploadsModule } from "./uploads/uploads.module";
import { UsersModule } from "./users/users.module";
import { PaymentsModule } from "./payments/payments.module";
import { WishlistModule } from "./wishlist/wishlist.module";
import { MailModule } from "./mail/mail.module";
import { SeoModule } from "./seo/seo.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { SeoThrottlerGuard } from "./common/guards/seo-throttler.guard";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { TransformInterceptor } from "./common/interceptors/transform.interceptor";
import { CacheInterceptor } from "./common/interceptors/cache.interceptor";
import { RobotsHeaderInterceptor } from "./seo/interceptors/robots-header.interceptor";
import { ConditionalRequestInterceptor } from "./common/interceptors/conditional-request.interceptor";

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    MailModule,
    AuthModule,
    CoursesModule,
    ContactsModule,
    SubscriptionsModule,
    TestimonialsModule,
    BlogPostsModule,
    TeamMembersModule,
    ServicesModule,
    FAQsModule,
    CaseStudiesModule,
    AnnouncementsModule,
    UploadsModule,
    UsersModule,
    PaymentsModule,
    WishlistModule,
    SeoModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: SeoThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ConditionalRequestInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CacheInterceptor },
    { provide: APP_INTERCEPTOR, useClass: RobotsHeaderInterceptor },
  ],
})
export class AppModule {}
