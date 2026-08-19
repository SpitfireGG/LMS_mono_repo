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
  QueryParams,
  PaymentItem,
  PaymentConfig,
  CheckoutResult,
  CheckoutRequest,
  PaymentStatusValue,
  WishlistEntry,
  MockTestItem,
  MockTestFacets,
  MockTestAttempt,
  MockTestInput,
  MockTestKind,
  PublishStatus as PublishStatusValue,
} from './types';
import { getAccessToken, getSession, updateTokens, clearSession } from '../auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  /** Set once a request has already been retried after a token refresh. */
  retried?: boolean;
}

/** The API wraps every payload in `{ success, data, timestamp }`. */
function unwrap<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    'data' in payload &&
    typeof (payload as { success: unknown }).success === 'boolean'
  ) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

let refreshInFlight: Promise<boolean> | null = null;

/** Rotates the access token once, sharing a single request across callers. */
async function refreshSession(): Promise<boolean> {
  const session = getSession();
  if (!session?.refreshToken) return false;

  refreshInFlight ??= (async () => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
        credentials: 'include',
      });
      if (!response.ok) {
        clearSession();
        return false;
      }
      const tokens = unwrap<{ accessToken: string; refreshToken: string }>(await response.json());
      updateTokens(tokens.accessToken, tokens.refreshToken);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

async function fetchJson<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, retried, ...fetchOptions } = options;

  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  }

  const url = `${API_BASE}/api${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  const token = getAccessToken();

  // FormData sets its own multipart boundary — never force a content type on it.
  const isFormData = typeof FormData !== 'undefined' && fetchOptions.body instanceof FormData;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    credentials: 'include',
  });

  if (response.status === 401 && !retried && getSession()) {
    if (await refreshSession()) {
      return fetchJson<T>(endpoint, { ...options, retried: true });
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    const message = Array.isArray(error.message) ? error.message.join(', ') : error.message;
    throw new Error(message || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return unwrap<T>(await response.json());
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

/**
 * Turns a stored asset path into an absolute URL. Uploads are served by the
 * API, which is a different origin from the site in development.
 */
export function assetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

/**
 * Multipart upload with progress. `fetch` can't report upload progress, so
 * large media goes over XHR instead — the bytes stream straight from disk.
 */
function uploadWithProgress<T>(
  endpoint: string,
  formData: FormData,
  options: { method?: 'POST' | 'PATCH'; onProgress?: (p: UploadProgress) => void } = {}
): Promise<T> {
  const { method = 'POST', onProgress } = options;

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${API_BASE}/api${endpoint}`);
    xhr.withCredentials = true;

    const token = getAccessToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percent: Math.round((event.loaded / event.total) * 100),
        });
      };
    }

    xhr.onload = () => {
      let payload: unknown;
      try {
        payload = JSON.parse(xhr.responseText || '{}');
      } catch {
        payload = {};
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(unwrap<T>(payload));
        return;
      }

      const message = (payload as { message?: string | string[] })?.message;
      reject(new Error(
        (Array.isArray(message) ? message.join(', ') : message) || `Upload failed (${xhr.status})`
      ));
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload cancelled'));

    xhr.send(formData);
  });
}

function toFormData(input: MockTestInput, files: { pdf?: File; media?: File }): FormData {
  const form = new FormData();

  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      form.append(key, String(value));
    }
  });
  if (files.pdf) form.append('pdf', files.pdf);
  if (files.media) form.append('media', files.media);

  return form;
}

export const mockTestApi = {
  list: (params?: {
    search?: string;
    language?: string;
    category?: string;
    kind?: MockTestKind;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<MockTestItem>>('/mock-tests', params),

  facets: () => api.get<MockTestFacets>('/mock-tests/facets'),

  getBySlug: (slug: string) => api.get<MockTestItem>(`/mock-tests/slug/${slug}`),

  adminList: (params?: {
    search?: string;
    status?: PublishStatusValue;
    language?: string;
    kind?: MockTestKind;
    page?: number;
    limit?: number;
  }) => api.get<PaginatedResponse<MockTestItem>>('/mock-tests/admin/all', params),

  create: (
    input: MockTestInput,
    files: { pdf?: File; media?: File },
    onProgress?: (p: UploadProgress) => void
  ) => uploadWithProgress<MockTestItem>('/mock-tests', toFormData(input, files), { onProgress }),

  update: (
    id: string,
    input: Partial<MockTestInput>,
    files: { pdf?: File; media?: File } = {},
    onProgress?: (p: UploadProgress) => void
  ) =>
    uploadWithProgress<MockTestItem>(
      `/mock-tests/${id}`,
      toFormData(input as MockTestInput, files),
      { method: 'PATCH', onProgress }
    ),

  remove: (id: string) => api.delete<MockTestItem>(`/mock-tests/${id}`),

  saveAttempt: (
    mockTestId: string,
    recording: Blob,
    meta: { durationSeconds?: number; notes?: string } = {},
    onProgress?: (p: UploadProgress) => void
  ) => {
    const form = new FormData();
    const extension = recording.type.includes('ogg') ? 'ogg' : 'webm';
    form.append('recording', recording, `attempt.${extension}`);
    if (meta.durationSeconds !== undefined) {
      form.append('durationSeconds', String(Math.round(meta.durationSeconds)));
    }
    if (meta.notes) form.append('notes', meta.notes);

    return uploadWithProgress<MockTestAttempt>(
      `/mock-tests/${mockTestId}/attempts`,
      form,
      { onProgress }
    );
  },

  myAttempts: (mockTestId?: string) =>
    api.get<MockTestAttempt[]>('/mock-tests/attempts/mine', { mockTestId }),

  deleteAttempt: (attemptId: string) =>
    api.delete<{ id: string; removed: boolean }>(`/mock-tests/attempts/${attemptId}`),
};

export const wishlistApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<WishlistEntry>>('/wishlist', params),

  ids: () => api.get<string[]>('/wishlist/ids'),

  add: (courseId: string) => api.post<WishlistEntry>('/wishlist', { courseId }),

  remove: (courseId: string) =>
    api.delete<{ courseId: string; removed: boolean }>(`/wishlist/${courseId}`),

  clear: () => api.delete<{ removed: number }>('/wishlist/all'),
};

export const paymentApi = {
  config: () => api.get<PaymentConfig>('/payments/config'),

  checkout: (data: CheckoutRequest) => api.post<CheckoutResult>('/payments/checkout', data),

  list: (params?: { status?: PaymentStatusValue; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<PaymentItem>>('/payments', params),

  getById: (id: string) => api.get<PaymentItem>(`/payments/${id}`),

  /** Asks the API to re-read the payment from Stripe/Payoneer. */
  refresh: (id: string) => api.post<PaymentItem>(`/payments/${id}/refresh`, {}),

  /** Only available while the provider runs without credentials. */
  sandbox: (id: string, decision: 'approve' | 'decline') =>
    api.post<PaymentItem>(`/payments/${id}/sandbox`, { decision }),
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
