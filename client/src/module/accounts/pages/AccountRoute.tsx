import { useAppSelector } from "../../../hooks/UseCustomeRedux";
import { selectAuth } from "../../auth/store/authSlice";
import AccountPage from "./AccountPage";

const AccountRoute = () => {
  const { currentUser } = useAppSelector(selectAuth);

  // Chưa đăng nhập
  if (!currentUser) {
    return (
      <div className="p-4 text-slate-100">
        Bạn cần đăng nhập để xem trang tài khoản.
      </div>
    );
  }

  // Người dùng có nhưng thiếu dữ liệu TMDB (chưa liên kết TMDB)
  if (!currentUser.sessionId || !currentUser.accountId) {
    return (
      <div className="p-4 text-slate-100 space-y-2">
        <p className="text-red-400 font-semibold">
          Tài khoản này chưa liên kết với TMDB.
        </p>
        <p className="text-slate-300 text-sm">
          Vui lòng vào phần cài đặt để kết nối API Key, Session ID và Account ID
          TMDB.
        </p>
      </div>
    );
  }

  // API Key rỗng → user vẫn chưa setup TMDB
  if (!currentUser.apiKey) {
    return (
      <div className="p-4 text-slate-100 space-y-2">
        <p className="text-red-400 font-semibold">
          Bạn chưa cấu hình TMDB API Key.
        </p>
        <p className="text-slate-300 text-sm">
          Hãy thêm API Key trong trang cấu hình tài khoản.
        </p>
      </div>
    );
  }

  // OK → Render trang Account chính
  return (
    <AccountPage
      apiKey={currentUser.apiKey}
      sessionId={currentUser.sessionId}
      accountId={currentUser.accountId}
    />
  );
};

export default AccountRoute;
