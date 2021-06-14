import { render, screen } from "@testing-library/react";
import { Header } from ".";

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

//! Por está usando o componente signInButton e dentro do mesmo usar uma função do useSession(Algo externo) se é necessário mockar para funcionar.

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});

describe("Header component", () => {
  it("renders correctly", () => {
    render(<Header />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});
