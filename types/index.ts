export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  country: string;
  birth: string;
  permissions: string;
  createdAt: string;
  photo: string;
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
}

export type Editor = Website & ThreeDCG & Animation;

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
}

export interface Component {
  _id: string;
  userId: string;
  componentsType: ComponentType;
  title: string;
  styleFileName: string;
  createdAt: string;
  updatedAt: string;
}