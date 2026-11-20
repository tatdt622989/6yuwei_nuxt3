/** The signed-in account, from the API's /session/me and /me (composables/useAuth.ts). */
export interface User {
  /** The account id at the identity provider (sub) */
  id: string;
  name: string;
  email: string;
  /** Profile picture URL, or "" */
  picture: string;
  isAdmin: boolean;
  balance: number;
  /** The identity provider's account page (name, picture, password) */
  accountUrl: string;
}

export interface Photo {
  _id?: string;
  url: string;
  size: number;
  updatedAt: string;
  createdAt: string;
}

export interface Website {
  _id?: string;
  title: string;
  description: string;
  textEditor: string;
  category: string;
  externalLink: string;
  photos: Photo[];
  updatedAt: string;
  createdAt: string;
  visible: boolean;
  homepage: boolean;
  top: boolean;
  sort: number;
}

export interface ThreeDCG {
  _id?: string;
  title: string;
  description: string;
  textEditor: string;
  category: string;
  externalLink: string;
  photos: Photo[];
  updatedAt: string;
  createdAt: string;
  visible: boolean;
  homepage: boolean;
  top: boolean;
  sort: number;
}

export interface Animation {
  _id?: string;
  title: string;
  description: string;
  textEditor: string;
  category: string;
  externalLink: string;
  youtubeLink: string;
  photos: Photo[];
  updatedAt: string;
  createdAt: string;
  visible: boolean;
  homepage: boolean;
  top: boolean;
  sort: number;
}

export interface Editor extends Website, ThreeDCG, Animation {}

export interface BreadCrumb {
  name: string;
  link: string;
}

export interface Contact {
  _id: string;
  email: string;
  message: string;
}

export interface ComponentType {
  _id: string;
  customURL: string;
  title: string;
  html: string;
  javascript: string;
  createdAt: string;
  updatedAt: string;
  coverFileName?: string;
}

export interface SiteComponent {
  _id: string;
  userId: string;
  componentsType: ComponentType;
  title: string;
  styleFileName: string;
  javascriptFileName: string;
  screenshotFileName: string;
  createdAt: string;
  updatedAt: string;
  style?: string;
  html?: string;
}
