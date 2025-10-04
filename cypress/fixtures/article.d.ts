declare module "./article.json" {
  export interface ArticleFixture {
    title: string;
    description: string;
    body: string;
    tag: string;
  }

  const value: {
    validArticles: ArticleFixture;
  };

  export default value;
}