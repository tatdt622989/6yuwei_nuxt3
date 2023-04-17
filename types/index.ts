export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Photo {
  _id?: string;
  url: string;
  updatedAt: string;
  createdAt: string;
}

export interface Editor {
  _id: string;
  title: string;
  externalLink: string;
  category: string;
  description: string;
  textEditor: string;
  photos: Photo[];
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
} 