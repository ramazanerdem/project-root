export class Post {
  id: number;
  userId: number;
  title: string;

  constructor(partial: Partial<Post>) {
    Object.assign(this, partial);
  }
}
