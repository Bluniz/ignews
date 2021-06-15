import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { stripe } from "../../services/stripe";

import Home, { getStaticProps } from "../../pages/index";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});
jest.mock("../../services/stripe");

describe("Home Page", () => {
  it("renders  correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "R$10,00" }} />);

    expect(screen.getByText("for R$10,00 mouth")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    //! Quando é uma promisse usamos um mockResolveValue
    retrieveStripePricesMocked.mockResolvedValue({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    //! Espero que os valores retornados sejam iguais ao
    //! Como estamos utilizando o expect.objectContaining, verificamos se ele contem essas props
    //? Se não utilizassemos o mesmo, ele verificaria se é exatamente igual
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
