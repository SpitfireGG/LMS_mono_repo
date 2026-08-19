import { 
  useQuery, 
  useInfiniteQuery, 
  useMutation, 
  useQueryClient,
  QueryKey,
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { 
  courseApi, 
  blogApi, 
  testimonialApi, 
  faqApi, 
  serviceApi, 
  teamApi, 
  announcementApi, 
  caseStudyApi,
  contactApi,
  subscriptionApi,
  wishlistApi,
  paymentApi,
  mockTestApi,
} from './client';
import type {
  CourseItem,
  BlogPostItem,
  TestimonialItem,
  FAQItem,
  ServiceItem,
  TeamMemberItem,
  AnnouncementItem,
  CaseStudyItem,
  PaginatedResponse,
  PublishStatus,
  WishlistEntry,
  PaymentItem,
  PaymentConfig,
  CheckoutRequest,
  CheckoutResult,
  MockTestItem,
  MockTestFacets,
  MockTestAttempt,
  MockTestInput,
  MockTestKind,
} from './types';
import { useIsAuthenticated } from '../auth';

const STALE_TIME = 5 * 60 * 1000;
const GC_TIME = 10 * 60 * 1000;

export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.courses.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.courses.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.courses.all, 'slug', slug] as const,
  },
  blogs: {
    all: ['blogs'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.blogs.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.blogs.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.blogs.all, 'slug', slug] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.testimonials.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.testimonials.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.testimonials.all, 'slug', slug] as const,
  },
  faqs: {
    all: ['faqs'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.faqs.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.faqs.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.faqs.all, 'slug', slug] as const,
  },
  services: {
    all: ['services'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.services.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.services.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.services.all, 'slug', slug] as const,
  },
  team: {
    all: ['team'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.team.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.team.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.team.all, 'slug', slug] as const,
  },
  announcements: {
    all: ['announcements'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.announcements.all, 'list', params] as const,
    active: () => [...queryKeys.announcements.all, 'active'] as const,
    detail: (id: string) => [...queryKeys.announcements.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.announcements.all, 'slug', slug] as const,
  },
  caseStudies: {
    all: ['caseStudies'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.caseStudies.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.caseStudies.all, 'detail', id] as const,
    slug: (slug: string) => [...queryKeys.caseStudies.all, 'slug', slug] as const,
  },
  wishlist: {
    all: ['wishlist'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.wishlist.all, 'list', params] as const,
    ids: () => [...queryKeys.wishlist.all, 'ids'] as const,
  },
  payments: {
    all: ['payments'] as const,
    config: () => [...queryKeys.payments.all, 'config'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.payments.all, 'list', params] as const,
    detail: (id: string) => [...queryKeys.payments.all, 'detail', id] as const,
  },
  mockTests: {
    all: ['mockTests'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.mockTests.all, 'list', params] as const,
    adminList: (params?: Record<string, unknown>) => [...queryKeys.mockTests.all, 'admin', params] as const,
    facets: () => [...queryKeys.mockTests.all, 'facets'] as const,
    slug: (slug: string) => [...queryKeys.mockTests.all, 'slug', slug] as const,
    attempts: (mockTestId?: string) => [...queryKeys.mockTests.all, 'attempts', mockTestId ?? 'all'] as const,
  },
};

function getQueryOptions<T>(
  queryKey: QueryKey,
  queryFn: () => Promise<T>,
  options?: Partial<UseQueryOptions<T, Error, T, QueryKey>>
) {
  return {
    queryKey,
    queryFn,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  };
}

function getInfiniteQueryOptions<T>(
  queryKey: QueryKey,
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<PaginatedResponse<T>>,
  options?: Record<string, unknown>
) {
  return {
    queryKey,
    queryFn,
    getNextPageParam: (lastPage: PaginatedResponse<T>) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnWindowFocus: false,
    retry: 1,
    ...options,
  };
}

export function useCourses(
  params?: {
    search?: string;
    category?: string;
    level?: string;
    priceRange?: 'lt200' | '200to300' | 'gt300';
    minRating?: number;
    sort?: 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'students';
    page?: number;
    limit?: number;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<CourseItem>, Error, PaginatedResponse<CourseItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.courses.list(params),
    () => courseApi.list(params),
    options
  ));
}

export function useInfiniteCourses(
  params?: Omit<{
    search?: string;
    category?: string;
    level?: string;
    priceRange?: 'lt200' | '200to300' | 'gt300';
    minRating?: number;
    sort?: 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'students';
    page?: number;
    limit?: number;
  }, 'page'>,
  options?: Record<string, unknown>
) {
  return useInfiniteQuery(getInfiniteQueryOptions<CourseItem>(
    queryKeys.courses.list(params),
    ({ pageParam }) => courseApi.list({ ...params, page: pageParam }),
    options
  ));
}

export function useCourseBySlug(
  slug: string,
  options?: Partial<UseQueryOptions<CourseItem & { seo: CourseItem['seo'] }, Error, CourseItem & { seo: CourseItem['seo'] }, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.courses.slug(slug),
    () => courseApi.getBySlug(slug),
    { enabled: !!slug, ...options }
  ));
}

export function useCourseById(
  id: string,
  options?: Partial<UseQueryOptions<CourseItem & { seo: CourseItem['seo'] }, Error, CourseItem & { seo: CourseItem['seo'] }, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.courses.detail(id),
    () => courseApi.getById(id),
    { enabled: !!id, ...options }
  ));
}

export function useBlogs(
  params?: {
    search?: string;
    tag?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<BlogPostItem>, Error, PaginatedResponse<BlogPostItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.blogs.list(params),
    () => blogApi.list(params),
    options
  ));
}

export function useInfiniteBlogs(
  params?: Omit<{
    search?: string;
    tag?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }, 'page'>,
  options?: Record<string, unknown>
) {
  return useInfiniteQuery(getInfiniteQueryOptions<BlogPostItem>(
    queryKeys.blogs.list(params),
    ({ pageParam }) => blogApi.list({ ...params, page: pageParam }),
    options
  ));
}

export function useBlogBySlug(
  slug: string,
  options?: Partial<UseQueryOptions<BlogPostItem & { seo: BlogPostItem['seo'] }, Error, BlogPostItem & { seo: BlogPostItem['seo'] }, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.blogs.slug(slug),
    () => blogApi.getBySlug(slug),
    { enabled: !!slug, ...options }
  ));
}

export function useTestimonials(
  params?: {
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<TestimonialItem>, Error, PaginatedResponse<TestimonialItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.testimonials.list(params),
    () => testimonialApi.list(params),
    options
  ));
}

export function useInfiniteTestimonials(
  params?: Omit<{
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }, 'page'>,
  options?: Record<string, unknown>
) {
  return useInfiniteQuery(getInfiniteQueryOptions<TestimonialItem>(
    queryKeys.testimonials.list(params),
    ({ pageParam }) => testimonialApi.list({ ...params, page: pageParam }),
    options
  ));
}

export function useFAQs(
  params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<FAQItem>, Error, PaginatedResponse<FAQItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.faqs.list(params),
    () => faqApi.list(params),
    options
  ));
}

export function useInfiniteFAQs(
  params?: Omit<{
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }, 'page'>,
  options?: Record<string, unknown>
) {
  return useInfiniteQuery(getInfiniteQueryOptions<FAQItem>(
    queryKeys.faqs.list(params),
    ({ pageParam }) => faqApi.list({ ...params, page: pageParam }),
    options
  ));
}

export function useServices(
  params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<ServiceItem>, Error, PaginatedResponse<ServiceItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.services.list(params),
    () => serviceApi.list(params),
    options
  ));
}

export function useInfiniteServices(
  params?: Omit<{
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }, 'page'>,
  options?: Record<string, unknown>
) {
  return useInfiniteQuery(getInfiniteQueryOptions<ServiceItem>(
    queryKeys.services.list(params),
    ({ pageParam }) => serviceApi.list({ ...params, page: pageParam }),
    options
  ));
}

export function useTeamMembers(
  params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<TeamMemberItem>, Error, PaginatedResponse<TeamMemberItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.team.list(params),
    () => teamApi.list(params),
    options
  ));
}

export function useInfiniteTeamMembers(
  params?: Omit<{
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }, 'page'>,
  options?: Record<string, unknown>
) {
  return useInfiniteQuery(getInfiniteQueryOptions<TeamMemberItem>(
    queryKeys.team.list(params),
    ({ pageParam }) => teamApi.list({ ...params, page: pageParam }),
    options
  ));
}

export function useAnnouncements(
  params?: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<AnnouncementItem>, Error, PaginatedResponse<AnnouncementItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.announcements.list(params),
    () => announcementApi.list(params),
    options
  ));
}

export function useActiveAnnouncement(
  options?: Partial<UseQueryOptions<AnnouncementItem[], Error, AnnouncementItem[], QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.announcements.active(),
    () => announcementApi.getActive(),
    options
  ));
}

export function useCaseStudies(
  params?: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<CaseStudyItem>, Error, PaginatedResponse<CaseStudyItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.caseStudies.list(params),
    () => caseStudyApi.list(params),
    options
  ));
}

export function useInfiniteCaseStudies(
  params?: Omit<{
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }, 'page'>,
  options?: Record<string, unknown>
) {
  return useInfiniteQuery(getInfiniteQueryOptions<CaseStudyItem>(
    queryKeys.caseStudies.list(params),
    ({ pageParam }) => caseStudyApi.list({ ...params, page: pageParam }),
    options
  ));
}

export function useSubmitContact(
  options?: Partial<UseMutationOptions<{ id: string; createdAt: string }, Error, {
    enquiryType: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    courseOfInterest?: string;
    preferredContact: string;
    message: string;
    consented: boolean;
  }, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactApi.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
    ...options,
  });
}

export function useSubscribe(
  options?: Partial<UseMutationOptions<{ id: string; email: string; active: boolean; createdAt: string }, Error, string, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.subscribe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
    },
    ...options,
  });
}

// ── Wishlist ────────────────────────────────────────────────────────

export function useWishlist(
  params?: { page?: number; limit?: number },
  options?: Partial<UseQueryOptions<PaginatedResponse<WishlistEntry>, Error, PaginatedResponse<WishlistEntry>, QueryKey>>
) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery(getQueryOptions(
    queryKeys.wishlist.list(params),
    () => wishlistApi.list(params),
    { enabled: isAuthenticated, ...options }
  ));
}

/** Course ids on the wishlist — what the heart buttons read. */
export function useWishlistIds(
  options?: Partial<UseQueryOptions<string[], Error, string[], QueryKey>>
) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery(getQueryOptions(
    queryKeys.wishlist.ids(),
    () => wishlistApi.ids(),
    { enabled: isAuthenticated, ...options }
  ));
}

export function useToggleWishlist(
  options?: Partial<UseMutationOptions<{ courseId: string; wishlisted: boolean }, Error, { courseId: string; wishlisted: boolean }, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, wishlisted }: { courseId: string; wishlisted: boolean }) => {
      if (wishlisted) await wishlistApi.remove(courseId);
      else await wishlistApi.add(courseId);
      return { courseId, wishlisted: !wishlisted };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    ...options,
  });
}

export function useRemoveFromWishlist(
  options?: Partial<UseMutationOptions<{ courseId: string; removed: boolean }, Error, string, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => wishlistApi.remove(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    ...options,
  });
}

// ── Payments ────────────────────────────────────────────────────────

export function usePaymentConfig(
  options?: Partial<UseQueryOptions<PaymentConfig, Error, PaymentConfig, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.payments.config(),
    () => paymentApi.config(),
    options
  ));
}

export function useCreateCheckout(
  options?: Partial<UseMutationOptions<CheckoutResult, Error, CheckoutRequest, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.checkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    ...options,
  });
}

export function usePayment(
  id: string,
  options?: Partial<UseQueryOptions<PaymentItem, Error, PaymentItem, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.payments.detail(id),
    () => paymentApi.getById(id),
    { enabled: !!id, staleTime: 0, ...options }
  ));
}

export function usePayments(
  params?: { page?: number; limit?: number },
  options?: Partial<UseQueryOptions<PaginatedResponse<PaymentItem>, Error, PaginatedResponse<PaymentItem>, QueryKey>>
) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery(getQueryOptions(
    queryKeys.payments.list(params),
    () => paymentApi.list(params),
    { enabled: isAuthenticated, ...options }
  ));
}

/** Pulls the live provider status — used while returning from a hosted page. */
export function useRefreshPayment(
  options?: Partial<UseMutationOptions<PaymentItem, Error, string, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => paymentApi.refresh(id),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(payment.id), payment);
    },
    ...options,
  });
}

export function useSandboxDecision(
  options?: Partial<UseMutationOptions<PaymentItem, Error, { id: string; decision: 'approve' | 'decline' }, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: 'approve' | 'decline' }) =>
      paymentApi.sandbox(id, decision),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(payment.id), payment);
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
    },
    ...options,
  });
}

// ── Practice sessions (mock tests & interviews) ─────────────────────

export function useMockTests(
  params?: {
    search?: string;
    language?: string;
    category?: string;
    kind?: MockTestKind;
    page?: number;
    limit?: number;
  },
  options?: Partial<UseQueryOptions<PaginatedResponse<MockTestItem>, Error, PaginatedResponse<MockTestItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.mockTests.list(params),
    () => mockTestApi.list(params),
    options
  ));
}

export function useMockTestFacets(
  options?: Partial<UseQueryOptions<MockTestFacets, Error, MockTestFacets, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.mockTests.facets(),
    () => mockTestApi.facets(),
    options
  ));
}

export function useMockTestBySlug(
  slug: string,
  options?: Partial<UseQueryOptions<MockTestItem, Error, MockTestItem, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.mockTests.slug(slug),
    () => mockTestApi.getBySlug(slug),
    { enabled: !!slug, ...options }
  ));
}

export function useAdminMockTests(
  params?: { search?: string; page?: number; limit?: number },
  options?: Partial<UseQueryOptions<PaginatedResponse<MockTestItem>, Error, PaginatedResponse<MockTestItem>, QueryKey>>
) {
  return useQuery(getQueryOptions(
    queryKeys.mockTests.adminList(params),
    () => mockTestApi.adminList(params),
    { staleTime: 0, ...options }
  ));
}

export function useCreateMockTest(
  options?: Partial<UseMutationOptions<MockTestItem, Error, {
    input: MockTestInput;
    files: { pdf?: File; media?: File };
    onProgress?: (p: { percent: number; loaded: number; total: number }) => void;
  }, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, files, onProgress }: {
      input: MockTestInput;
      files: { pdf?: File; media?: File };
      onProgress?: (p: { percent: number; loaded: number; total: number }) => void;
    }) => mockTestApi.create(input, files, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockTests.all });
    },
    ...options,
  });
}

export function useUpdateMockTest(
  options?: Partial<UseMutationOptions<MockTestItem, Error, {
    id: string;
    input: Partial<MockTestInput>;
    files?: { pdf?: File; media?: File };
    onProgress?: (p: { percent: number; loaded: number; total: number }) => void;
  }, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input, files, onProgress }: {
      id: string;
      input: Partial<MockTestInput>;
      files?: { pdf?: File; media?: File };
      onProgress?: (p: { percent: number; loaded: number; total: number }) => void;
    }) => mockTestApi.update(id, input, files, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockTests.all });
    },
    ...options,
  });
}

export function useDeleteMockTest(
  options?: Partial<UseMutationOptions<MockTestItem, Error, string, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mockTestApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockTests.all });
    },
    ...options,
  });
}

export function useMyAttempts(
  mockTestId?: string,
  options?: Partial<UseQueryOptions<MockTestAttempt[], Error, MockTestAttempt[], QueryKey>>
) {
  const isAuthenticated = useIsAuthenticated();
  return useQuery(getQueryOptions(
    queryKeys.mockTests.attempts(mockTestId),
    () => mockTestApi.myAttempts(mockTestId),
    { enabled: isAuthenticated, staleTime: 0, ...options }
  ));
}

export function useSaveAttempt(
  options?: Partial<UseMutationOptions<MockTestAttempt, Error, {
    mockTestId: string;
    recording: Blob;
    durationSeconds?: number;
    notes?: string;
  }, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ mockTestId, recording, durationSeconds, notes }: {
      mockTestId: string;
      recording: Blob;
      durationSeconds?: number;
      notes?: string;
    }) => mockTestApi.saveAttempt(mockTestId, recording, { durationSeconds, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockTests.all });
    },
    ...options,
  });
}

export function useDeleteAttempt(
  options?: Partial<UseMutationOptions<{ id: string; removed: boolean }, Error, string, unknown>>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => mockTestApi.deleteAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mockTests.all });
    },
    ...options,
  });
}

export function usePrefetchCourse(slug: string) {
  const queryClient = useQueryClient();
  return queryClient.prefetchQuery({
    queryKey: queryKeys.courses.slug(slug),
    queryFn: () => courseApi.getBySlug(slug),
    staleTime: STALE_TIME,
  });
}

export function usePrefetchBlog(slug: string) {
  const queryClient = useQueryClient();
  return queryClient.prefetchQuery({
    queryKey: queryKeys.blogs.slug(slug),
    queryFn: () => blogApi.getBySlug(slug),
    staleTime: STALE_TIME,
  });
}

export function useInvalidateCourses() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
}

export function useInvalidateBlogs() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
}

export function useInvalidateTestimonials() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.testimonials.all });
}

export function useInvalidateFAQs() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
}

export function useInvalidateServices() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
}

export function useInvalidateTeam() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.team.all });
}

export function useInvalidateAnnouncements() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
}

export function useInvalidateCaseStudies() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.caseStudies.all });
}