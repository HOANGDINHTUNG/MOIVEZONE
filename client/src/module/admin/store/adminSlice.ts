import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../../stores";

export type AdminFeatureKey =
  | "showHomeBanner"
  | "showHomeTrending"
  | "showHomeLatestTrailers"
  | "showHomeEvents"
  | "showHistoryChangesSection"
  | "enableUserReviews"
  | "enableUserWatchlist"
  | "enableUserRating";

export interface AdminFeature {
  key: AdminFeatureKey;
  label: string;
  description?: string;
  group: "Homepage" | "User" | "Content";
  value: boolean;
}

export interface RestrictedTitle {
  id: number;
  mediaType: "movie" | "tv";
  reason?: string;
  createdAt: string;
}

export interface BlockedUser {
  id: string; // userId hoặc username
  displayName: string;
  reason?: string;
  createdAt: string;
}

export interface AdminSectionConfig {
  id: string; 
  title: string;
  description?: string;
  visible: boolean;
  order: number;
}

export type AdminActivityType =
  | "feature-toggle"
  | "section-visibility"
  | "section-order"
  | "notice";

export interface AdminActivity {
  id: string;
  type: AdminActivityType;
  message: string;
  createdAt: string; // ISO
}

export interface AdminState {
  features: AdminFeature[];
  sections: AdminSectionConfig[];
  activity: AdminActivity[];
  restrictedTitles: RestrictedTitle[];
  blockedUsers: BlockedUser[];
}

const STORAGE_KEY = "moviezone_admin_state_v1";

const loadAdminState = (): Partial<AdminState> | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AdminState>;
  } catch {
    return null;
  }
};

const persistAdminState = (state: AdminState) => {
  if (typeof window === "undefined") return;
  try {
    // tránh lưu activity quá nặng -> chỉ giữ 50 gần nhất
    const toSave: AdminState = {
      ...state,
      activity: state.activity.slice(0, 50),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
};

const baseInitialState: AdminState = {
  features: [
    {
      key: "showHomeBanner",
      label: "Hiển thị Banner Hero trên trang chủ",
      description: "Banner lớn ở đầu trang Home (BannerHome).",
      group: "Homepage",
      value: true,
    },
    {
      key: "showHomeTrending",
      label: "Hiển thị Trending Today",
      description: "Section phim/TV thịnh hành hôm nay.",
      group: "Homepage",
      value: true,
    },
    {
      key: "showHomeLatestTrailers",
      label: "Hiển thị Latest Trailers",
      description: "Dải trailer mới nhất trên trang chủ.",
      group: "Homepage",
      value: true,
    },
    {
      key: "showHomeEvents",
      label: "Hiển thị Events",
      description: "Section sự kiện của bạn.",
      group: "Homepage",
      value: true,
    },
    {
      key: "showHistoryChangesSection",
      label: "Hiển thị History / Changes",
      description: "Phần lịch sử thay đổi cho movie/TV.",
      group: "Content",
      value: true,
    },
    {
      key: "enableUserReviews",
      label: "Cho phép người dùng viết review",
      description: "Bật/tắt chức năng review trong app.",
      group: "User",
      value: true,
    },
    {
      key: "enableUserWatchlist",
      label: "Cho phép watchlist cá nhân",
      description: "Bật/tắt danh sách theo dõi người dùng.",
      group: "User",
      value: true,
    },
    {
      key: "enableUserRating",
      label: "Cho phép chấm điểm phim/TV",
      description: "Bật/tắt rating.",
      group: "User",
      value: true,
    },
  ],
  sections: [
    {
      id: "home-banner",
      title: "Home Banner Hero",
      description: "Component hero lớn trên Home.",
      visible: true,
      order: 1,
    },
    {
      id: "home-trending",
      title: "Home Trending",
      description: "Danh sách trending movie/TV.",
      visible: true,
      order: 2,
    },
    {
      id: "home-latest-trailers",
      title: "Home Latest Trailers",
      description: "Dải preview trailer mới nhất.",
      visible: true,
      order: 3,
    },
    {
      id: "home-events",
      title: "Home Events",
      description: "Section sự kiện (EventsList rút gọn).",
      visible: true,
      order: 4,
    },
    {
      id: "home-history",
      title: "Home History / Changes snippet",
      description: "Một block tóm tắt thay đổi gần đây.",
      visible: false,
      order: 5,
    },
  ],
  activity: [
    {
      id: nanoid(),
      type: "notice",
      message: "Admin dashboard được khởi tạo.",
      createdAt: new Date().toISOString(),
    },
  ],
  restrictedTitles: [],
  blockedUsers: [],
};

const initialState: AdminState = {
  ...baseInitialState,
  ...(loadAdminState() ?? {}),
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    toggleFeature(state, action: PayloadAction<AdminFeatureKey>) {
      const feature = state.features.find((f) => f.key === action.payload);
      if (!feature) return;
      feature.value = !feature.value;

      state.activity.unshift({
        id: nanoid(),
        type: "feature-toggle",
        message: `${feature.label} ${
          feature.value ? "đã được bật" : "đã được tắt"
        }.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },

    setSectionVisibility(
      state,
      action: PayloadAction<{ id: string; visible: boolean }>
    ) {
      const section = state.sections.find((s) => s.id === action.payload.id);
      if (!section) return;
      section.visible = action.payload.visible;

      state.activity.unshift({
        id: nanoid(),
        type: "section-visibility",
        message: `Section "${section.title}" ${
          section.visible ? "đang hiển thị" : "đã bị ẩn"
        }.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },

    moveSectionUp(state, action: PayloadAction<string>) {
      const index = state.sections.findIndex((s) => s.id === action.payload);
      if (index <= 0) return;
      const tmp = state.sections[index - 1];
      state.sections[index - 1] = state.sections[index];
      state.sections[index] = tmp;

      state.sections.forEach((s, i) => {
        s.order = i + 1;
      });

      state.activity.unshift({
        id: nanoid(),
        type: "section-order",
        message: `Section "${
          state.sections[index - 1].title
        }" đã được di chuyển lên.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },

    moveSectionDown(state, action: PayloadAction<string>) {
      const index = state.sections.findIndex((s) => s.id === action.payload);
      if (index === -1 || index === state.sections.length - 1) return;
      const tmp = state.sections[index + 1];
      state.sections[index + 1] = state.sections[index];
      state.sections[index] = tmp;

      state.sections.forEach((s, i) => {
        s.order = i + 1;
      });

      state.activity.unshift({
        id: nanoid(),
        type: "section-order",
        message: `Section "${
          state.sections[index + 1].title
        }" đã được di chuyển xuống.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },

    addRestrictedTitle(
      state,
      action: PayloadAction<{
        id: number;
        mediaType: "movie" | "tv";
        reason?: string;
      }>
    ) {
      const exists = state.restrictedTitles.some(
        (r) =>
          r.id === action.payload.id && r.mediaType === action.payload.mediaType
      );
      if (exists) return;

      const newItem: RestrictedTitle = {
        id: action.payload.id,
        mediaType: action.payload.mediaType,
        reason: action.payload.reason,
        createdAt: new Date().toISOString(),
      };

      state.restrictedTitles.unshift(newItem);
      state.activity.unshift({
        id: nanoid(),
        type: "section-visibility",
        message: `Đã chặn truy cập ${
          newItem.mediaType === "movie" ? "phim" : "TV Show"
        } ID ${newItem.id}.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },

    removeRestrictedTitle(
      state,
      action: PayloadAction<{ id: number; mediaType: "movie" | "tv" }>
    ) {
      state.restrictedTitles = state.restrictedTitles.filter(
        (r) =>
          !(
            r.id === action.payload.id &&
            r.mediaType === action.payload.mediaType
          )
      );

      state.activity.unshift({
        id: nanoid(),
        type: "section-visibility",
        message: `Đã gỡ chặn ${
          action.payload.mediaType === "movie" ? "phim" : "TV Show"
        } ID ${action.payload.id}.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },

    blockUser(
      state,
      action: PayloadAction<{
        id: string;
        displayName: string;
        reason?: string;
      }>
    ) {
      const exist = state.blockedUsers.some((u) => u.id === action.payload.id);
      if (exist) return;

      state.blockedUsers.unshift({
        id: action.payload.id,
        displayName: action.payload.displayName,
        reason: action.payload.reason,
        createdAt: new Date().toISOString(),
      });

      state.activity.unshift({
        id: nanoid(),
        type: "feature-toggle",
        message: `Tài khoản "${action.payload.displayName}" đã bị chặn.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },

    unblockUser(state, action: PayloadAction<string>) {
      const user = state.blockedUsers.find((u) => u.id === action.payload);
      state.blockedUsers = state.blockedUsers.filter(
        (u) => u.id !== action.payload
      );

      state.activity.unshift({
        id: nanoid(),
        type: "feature-toggle",
        message: user
          ? `Tài khoản "${user.displayName}" đã được gỡ chặn.`
          : `Đã gỡ chặn tài khoản.`,
        createdAt: new Date().toISOString(),
      });

      persistAdminState(state);
    },
  },
});

export const {
  toggleFeature,
  setSectionVisibility,
  moveSectionUp,
  moveSectionDown,
  addRestrictedTitle,
  removeRestrictedTitle,
  blockUser,
  unblockUser,
} = adminSlice.actions;

export const selectAdminState = (state: RootState) => state.admin;

export default adminSlice.reducer;
