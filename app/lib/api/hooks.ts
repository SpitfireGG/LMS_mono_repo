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
} from './types';

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