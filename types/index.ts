export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Website {
  id?: number;
  title: string;
  description: string;
  textEditor: string;
  category: string;
  externalLink: string;
}