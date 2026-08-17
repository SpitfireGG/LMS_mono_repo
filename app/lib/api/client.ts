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
  QueryParams 
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function fetchJson<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...fetchOptions } = options;

  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }

  const url = `${API_BASE}/api${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) =>
    fetchJson<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body: unknown) =>
    fetchJson<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: unknown) =>
    fetchJson<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string) =>
    fetchJson<T>(endpoint, { method: 'DELETE' }),

  upload: <T>(endpoint: string, formData: FormData) =>
    fetchJson<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {},
    }),
};

export const courseApi = {
  list: (params?: {
    search?: string;
    category?: string;
    level?: string;
    priceRange?: 'lt200' | '200to300' | 'gt300';
    minRating?: number;
    sort?: 'popular' | 'rating' | 'price-asc' | 'price-desc' | 'students';
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<CourseItem>>('/courses', params),

  getBySlug: (slug: string) =>
    api.get<CourseItem & { seo: CourseItem['seo'] }>(`/courses/slug/${slug}`),

  getById: (id: string) =>
    api.get<CourseItem & { seo: CourseItem['seo'] }>(`/courses/${id}`),

  adminList: (params?: {
    search?: string;
    category?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<CourseItem>>('/courses/admin/all', params),

  create: (data: Partial<CourseItem>) =>
    api.post<CourseItem>('/courses', data),

  update: (id: string, data: Partial<CourseItem>) =>
    api.patch<CourseItem>(`/courses/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/courses/${id}`),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.upload<CourseItem>(`/courses/${id}/image`, formData);
  },
};

export const blogApi = {
  list: (params?: {
    search?: string;
    tag?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }) => api.get<PaginatedResponse<BlogPostItem>>('/blog-posts', params),

  getBySlug: (slug: string) =>
    api.get<BlogPostItem & { seo: BlogPostItem['seo'] }>(`/blog-posts/slug/${slug}`),

  getById: (id: string) =>
    api.get<BlogPostItem & { seo: BlogPostItem['seo'] }>(`/blog-posts/${id}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<BlogPostItem>>('/blog-posts/admin/all', params),

  create: (data: Partial<BlogPostItem>) =>
    api.post<BlogPostItem>('/blog-posts', data),

  update: (id: string, data: Partial<BlogPostItem>) =>
    api.patch<BlogPostItem>(`/blog-posts/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/blog-posts/${id}`),
};

export const testimonialApi = {
  list: (params?: {
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }) => api.get<PaginatedResponse<TestimonialItem>>('/testimonials', params),

  getBySlug: (slug: string) =>
    api.get<TestimonialItem & { seo: TestimonialItem['seo'] }>(`/testimonials/slug/${slug}`),

  getById: (id: string) =>
    api.get<TestimonialItem & { seo: TestimonialItem['seo'] }>(`/testimonials/${id}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<TestimonialItem>>('/testimonials/admin/all', params),

  create: (data: Partial<TestimonialItem>) =>
    api.post<TestimonialItem>('/testimonials', data),

  update: (id: string, data: Partial<TestimonialItem>) =>
    api.patch<TestimonialItem>(`/testimonials/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/testimonials/${id}`),
};

export const faqApi = {
  list: (params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }) => api.get<PaginatedResponse<FAQItem>>('/faqs', params),

  getBySlug: (slug: string) =>
    api.get<FAQItem & { seo: FAQItem['seo'] }>(`/faqs/slug/${slug}`),

  getById: (id: string) =>
    api.get<FAQItem & { seo: FAQItem['seo'] }>(`/faqs/${id}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<FAQItem>>('/faqs/admin/all', params),

  create: (data: Partial<FAQItem>) =>
    api.post<FAQItem>('/faqs', data),

  update: (id: string, data: Partial<FAQItem>) =>
    api.patch<FAQItem>(`/faqs/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/faqs/${id}`),
};

export const serviceApi = {
  list: (params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }) => api.get<PaginatedResponse<ServiceItem>>('/services', params),

  getBySlug: (slug: string) =>
    api.get<ServiceItem & { seo: ServiceItem['seo'] }>(`/services/slug/${slug}`),

  getById: (id: string) =>
    api.get<ServiceItem & { seo: ServiceItem['seo'] }>(`/services/${id}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<ServiceItem>>('/services/admin/all', params),

  create: (data: Partial<ServiceItem>) =>
    api.post<ServiceItem>('/services', data),

  update: (id: string, data: Partial<ServiceItem>) =>
    api.patch<ServiceItem>(`/services/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/services/${id}`),
};

export const teamApi = {
  list: (params?: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }) => api.get<PaginatedResponse<TeamMemberItem>>('/team-members', params),

  getBySlug: (slug: string) =>
    api.get<TeamMemberItem & { seo: TeamMemberItem['seo'] }>(`/team-members/slug/${slug}`),

  getById: (id: string) =>
    api.get<TeamMemberItem & { seo: TeamMemberItem['seo'] }>(`/team-members/${id}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<TeamMemberItem>>('/team-members/admin/all', params),

  create: (data: Partial<TeamMemberItem>) =>
    api.post<TeamMemberItem>('/team-members', data),

  update: (id: string, data: Partial<TeamMemberItem>) =>
    api.patch<TeamMemberItem>(`/team-members/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/team-members/${id}`),
};

export const announcementApi = {
  list: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }) => api.get<PaginatedResponse<AnnouncementItem>>('/announcements', params),

  getActive: () =>
    api.get<AnnouncementItem[]>('/announcements/active'),

  getBySlug: (slug: string) =>
    api.get<AnnouncementItem & { seo: AnnouncementItem['seo'] }>(`/announcements/slug/${slug}`),

  getById: (id: string) =>
    api.get<AnnouncementItem & { seo: AnnouncementItem['seo'] }>(`/announcements/${id}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<AnnouncementItem>>('/announcements/admin/all', params),

  create: (data: Partial<AnnouncementItem>) =>
    api.post<AnnouncementItem>('/announcements', data),

  update: (id: string, data: Partial<AnnouncementItem>) =>
    api.patch<AnnouncementItem>(`/announcements/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/announcements/${id}`),
};

export const caseStudyApi = {
  list: (params?: {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: PublishStatus;
  }) => api.get<PaginatedResponse<CaseStudyItem>>('/case-studies', params),

  getBySlug: (slug: string) =>
    api.get<CaseStudyItem & { seo: CaseStudyItem['seo'] }>(`/case-studies/slug/${slug}`),

  getById: (id: string) =>
    api.get<CaseStudyItem & { seo: CaseStudyItem['seo'] }>(`/case-studies/${id}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatus;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<CaseStudyItem>>('/case-studies/admin/all', params),

  create: (data: Partial<CaseStudyItem>) =>
    api.post<CaseStudyItem>('/case-studies', data),

  update: (id: string, data: Partial<CaseStudyItem>) =>
    api.patch<CaseStudyItem>(`/case-studies/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/case-studies/${id}`),
};

export const contactApi = {
  submit: (data: {
    enquiryType: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    courseOfInterest?: string;
    preferredContact: string;
    message: string;
    consented: boolean;
  }) => api.post<{ id: string; createdAt: string }>('/contacts', data),

  list: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<{
      id: string;
      enquiryType: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      courseOfInterest: string | null;
      preferredContact: string;
      message: string;
      consented: boolean;
      replied: boolean;
      createdAt: string;
    }>>('/contacts', params),
};

export const subscriptionApi = {
  subscribe: (email: string) =>
    api.post<{ id: string; email: string; active: boolean; createdAt: string }>('/subscriptions', { email }),

  list: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<{
      id: string;
      email: string;
      active: boolean;
      createdAt: string;
    }>>('/subscriptions', params),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; name: string; role: string; isEmailVerified: boolean };
    }>('/auth/login', { email, password }),

  signup: (name: string, email: string, password: string) =>
    api.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; name: string; role: string };
      message: string;
    }>('/auth/signup', { name, email, password }),

  googleLogin: (googleId: string, email: string, name: string, image?: string) =>
    api.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; name: string; role: string; image?: string; isEmailVerified: boolean };
    }>('/auth/google', { googleId, email, name, image }),

  verifyEmail: (token: string) =>
    api.post<{ message: string }>('/auth/verify-email', { token }),

  resendVerification: (email: string) =>
    api.post<{ message: string }>('/auth/resend-verification', { email }),

  refreshToken: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }),

  logout: () =>
    api.post<{ message: string }>('/auth/logout', {}),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),

  getProfile: () =>
    api.get<{ id: string; email: string; name: string; role: string; image?: string; isEmailVerified: boolean; createdAt: string }>('/auth/profile'),
};