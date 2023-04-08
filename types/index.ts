export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Website {
  id?: string;
  title: string;
  description: string;
  textEditor: string;
  category: string;
  externalLink: string;
} 