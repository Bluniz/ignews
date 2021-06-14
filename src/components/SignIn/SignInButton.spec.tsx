import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";
import { SignInButton } from ".";

jest.mock("next-auth/client");

//! Quando precisamos de um retorno diferente para diferentes testes, podemos utilizar o ts-jest com mocked para ajustar isto.

describe("SignInButton component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);

    //! Once quer dizer que quer mockar apenas este retorno.
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SignInButton />);

    expect(screen.getByText("Sign in with Github")).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = mocked(useSession);

    //! Once quer dizer que quer mockar apenas este retorno.
    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "Lucas Rosa", image: "", email: "fulano@gmail.com" },
        expires: "fake",
      },
      false,
    ]);

    render(<SignInButton />);

    expect(screen.getByText("Lucas Rosa")).toBeInTheDocument();
  });
});
