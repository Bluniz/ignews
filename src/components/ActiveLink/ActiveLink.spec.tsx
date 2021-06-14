import { render } from "@testing-library/react";
import { ActiveLink } from ".";

//! Render irá renderizar de forma virtual para que possamos testar.
//! Sempre que nosso componente estiver usando uma funcionalidade externa ao componente, precisamos criar mocks.

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

//! Categorização de testes
describe("ActiveLink component", () => {
  //! Todo teste consiste em executar uma ação e dizer o que esperamos.
  //? it significa "isto"
  it("renders correctly", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    //! Espero que tenha um elemento com o texto "Home" na minha DOM(Documento)
    expect(getByText("Home")).toBeInTheDocument();
  });

  it("adds active class if the link as currently active", () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    //! Espero que tenha um elemento com o texto "Home" tenha uma classe chamada 'active'
    expect(getByText("Home")).toHaveClass("active");
  });
});
