// Poster thay đổi
export interface ChangePoster {
  file_path: string;
}

// Keyword thay đổi
export interface ChangeKeyword {
  id: number;
  name: string;
}

// Value có thể chứa poster hoặc keyword tùy theo key
export interface ChangeValue {
  poster?: ChangePoster;
  name?: string; // keyword name
  id?: number;   // keyword id
}

// Một mục thay đổi
export interface ChangeItem {
  id: string;
  action: string;
  time: string;
  iso_639_1: string;
  iso_3166_1: string;
  value: ChangeValue;
}

// Nhóm thay đổi
export interface ChangeEntry {
  key: string;
  items: ChangeItem[];
}

// Response tổng
export interface MovieChanges {
  changes: ChangeEntry[];
}
