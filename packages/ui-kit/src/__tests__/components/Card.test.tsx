import React from "react";
import { render } from "@testing-library/react";
import { Card } from "../../components/Card";
import { Text } from "react-native";

describe("Card", () => {
  test("renders children", () => {
    const { getByText } = render(
      <Card>
        <Text>Hello World</Text>
      </Card>,
    );
    expect(getByText("Hello World")).toBeTruthy();
  });

  test("applies custom padding", () => {
    const { getByText } = render(
      <Card padding={32}>
        <Text>Custom Padding</Text>
      </Card>,
    );
    expect(getByText("Custom Padding")).toBeTruthy();
  });

  test("applies default padding when not specified", () => {
    const { getByText } = render(
      <Card>
        <Text>Default Padding</Text>
      </Card>,
    );
    expect(getByText("Default Padding")).toBeTruthy();
  });

  test("renders with zero padding", () => {
    const { getByText } = render(
      <Card padding={0}>
        <Text>No Padding</Text>
      </Card>,
    );
    expect(getByText("No Padding")).toBeTruthy();
  });

  test("renders with large padding", () => {
    const { getByText } = render(
      <Card padding={64}>
        <Text>Large Padding</Text>
      </Card>,
    );
    expect(getByText("Large Padding")).toBeTruthy();
  });

  test("renders multiple children", () => {
    const { getByText } = render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>,
    );
    expect(getByText("First Child")).toBeTruthy();
    expect(getByText("Second Child")).toBeTruthy();
  });

  test("renders nested components", () => {
    const { getByText } = render(
      <Card padding={24}>
        <Card padding={8}>
          <Text>Nested Card</Text>
        </Card>
      </Card>,
    );
    expect(getByText("Nested Card")).toBeTruthy();
  });
});
