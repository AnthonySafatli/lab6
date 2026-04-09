export default interface Project {
  id: number;
  title: string;
  author: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl: string | null;
  repoUrl: string;
}
