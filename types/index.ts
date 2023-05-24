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

export interface Editor {
  _id: string;
  title: string;
  externalLink: string;
  youtubeLink: string;
  category: string;
  description: string;
  textEditor: string;
  photos: Photo[];
  [key: string]: any;
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
}

export interface BreadCrumb {
  name: string;
  link: string;
}

export interface Contact {
  _id: string;
  email: string;
  message: string;
}