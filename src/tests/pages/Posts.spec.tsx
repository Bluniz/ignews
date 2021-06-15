import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";
import Posts, { getStaticProps } from "../../pages/posts";

const posts = [
  {
    slug: "my-new-post",
    title: "My new Post",
    excerpt: "Post excerpt",
    updatedAt: "10 de Abril",
  },
];

jest.mock("../../services/prismic");

describe("Posts Page", () => {
  it("renders  correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    //! MockResolvedValueOnce é pq usamos await e precisamos que execute apenas uma vez
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-new-post",
            data: {
              title: [
                {
                  type: "heading",
                  text: "My new Text",
                },
              ],
              content: [{ type: "paragraph", text: "Post excerpt" }],
            },
            last_publication_date: "04-01-2021",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    //! Espero que os valores retornados sejam iguais ao
    //! Como estamos utilizando o expect.objectContaining, verificamos se ele contem essas props
    //? Se não utilizassemos o mesmo, ele verificaria se é exatamente igual
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-new-post",
              title: "My new Text",
              excerpt: "Post excerpt",
              updatedAt: "01 de abril de 2021",
            },
          ],
        },
      })
    );
  });
});
