import { List } from "@raycast/api";
import { light, spacing, typography, shape } from "@atlaskit/tokens/tokens-raw";
import { useState } from "react";
import { TokenItem } from "./components/TokenItem";

type colorTheme = "light" | "dark";

const tokenMap = [
  { name: "Color", tokens: light },
  { name: "Spacing", tokens: spacing },
  { name: "Typography", tokens: typography },
  { name: "Shape", tokens: shape },
];

/**
 *
 * Command
 *
 * The main component for this command.
 */
export default function Command() {
  const [colorTheme, setcolorTheme] = useState<colorTheme>("light");

  return (
    <List
      navigationTitle="Atlassian Design Tokens (version 1.28.1)"
      searchBarAccessory={
        <ColorThemeDropdown
          onChange={(mode) => {
            setcolorTheme(mode);
          }}
        />
      }
    >
      {tokenMap.map((group, index) => (
        <List.Section key={index} title={group.name}>
          {group.tokens.map((token, index) => (
            <TokenItem
              colorTheme={colorTheme}
              key={index}
              index={index}
              //@ts-expect-error TODO: improve types for tokens-raw
              token={token}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}

const ColorThemeDropdown = ({ onChange }: { onChange: (mode: colorTheme) => void }) => (
  <List.Dropdown
    tooltip="Select Color Theme"
    storeValue={true}
    onChange={(newValue) => {
      onChange(newValue as colorTheme);
    }}
  >
    <List.Dropdown.Section title="Color Themes">
      <List.Dropdown.Item key={"light"} title={"atlassian-light"} value={"light"} />
      <List.Dropdown.Item key={"dark"} title={"atlassian-dark"} value={"dark"} />
    </List.Dropdown.Section>
  </List.Dropdown>
);
