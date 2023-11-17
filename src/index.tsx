import { ActionPanel, Detail, List, Action, Icon, Color } from "@raycast/api";
import { light, dark, spacing, typography, shape } from "@atlaskit/tokens/tokens-raw";
import { useState } from "react";

type colorTheme = "light" | "dark";

const tokenMap = [
  { name: "Color", tokens: light },
  { name: "Spacing", tokens: spacing },
  { name: "Typography", tokens: typography },
  { name: "Shape", tokens: shape },
];

export default function Command() {
  const [colorTheme, setcolorTheme] = useState<colorTheme>("light");

  return (
    <List
      navigationTitle="Search for tokens"
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

const TokenItem = ({
  colorTheme,
  index,
  token,
}: {
  colorTheme: "light" | "dark";
  index: number;
  token: (typeof light)[number];
}) => {
  const darkValue = dark[index].value.toString();
  const lightValue = token.value.toString();

  let displayValue = "white";
  if (token.attributes.group === "paint") {
    displayValue = colorTheme === "light" ? lightValue : darkValue;
  }

  // Choose icon based on type of token and target element
  let icon: { source: Icon; tintColor?: Color.ColorLike } = { source: Icon.Warning };
  if (token.attributes.group === "paint") {
    icon = { source: Icon.CircleFilled, tintColor: displayValue as string };
  }
  if (token.attributes.group === "spacing") {
    icon = { source: Icon.Ruler };
  }
  if (["typography", "letterSpacing", "fontFamily", "fontSize", "fontWeight"].includes(token.attributes.group)) {
    icon = { source: Icon.Text };
  }
  if (["lineHeight"].includes(token.attributes.group)) {
    icon = { source: Icon.TextCursor };
  }
  if (token.attributes.group === "shape") {
    icon = { source: Icon.EditShape };
  }
  if (token.attributes.group === "opacity") {
    icon = { source: Icon.EyeDisabled };
  }
  if (token.attributes.group === "raw") {
    icon = { source: Icon.Code };
  }
  if (token.attributes.group === "shadow") {
    icon = { source: Icon.Sun };
  }

  return (
    <List.Item
      title={token.cleanName}
      icon={icon}
      // detail={TokenDetails}
      subtitle={token.attributes.description}
      // accessories={}
      actions={<TokenActionPanel token={token} index={index} />}
    />
  );
};

const TokenActionPanel = ({
  showDetailAction = true,
  token,
  index,
}: {
  showDetailAction?: boolean;
  token: (typeof light)[0];
  index: number;
}) => {
  const darkValue = dark[index].value.toString();
  const lightValue = token.value.toString();

  return (
    <ActionPanel>
      {showDetailAction && <Action.Push title="View Details" target={<TokenDetails token={token} index={index} />} />}
      <Action.CopyToClipboard
        title="Copy Name"
        icon={{ source: Icon.Text }}
        content={token.cleanName}
        shortcut={{ modifiers: ["cmd"], key: "." }}
      />
      <Action.CopyToClipboard
        title="Copy Code"
        icon={{ source: Icon.Code }}
        content={`token('${token.cleanName}')`}
        shortcut={{ modifiers: ["cmd", "shift"], key: "." }}
      />
      // Copy light/dark values if they exist
      {token.attributes.group === "paint" ? (
        <>
          <Action.CopyToClipboard
            title="Copy Light Value"
            icon={{ source: Icon.Sun }}
            content={lightValue}
            shortcut={{ modifiers: ["cmd", "opt"], key: "," }}
          />
          <Action.CopyToClipboard
            title="Copy Dark Value"
            icon={{ source: Icon.Moon }}
            content={darkValue}
            shortcut={{ modifiers: ["cmd", "opt"], key: "." }}
          />
        </>
      ) : (
        <Action.CopyToClipboard
          title="Copy Value"
          icon={{ source: Icon.TextInput }}
          content={token.value.toString()}
          shortcut={{ modifiers: ["cmd", "opt"], key: "." }}
        />
      )}
      <Action.OpenInBrowser
        title="View on Atlassian Design System"
        url={`https://atlassian.design/components/tokens/all-tokens#${token.cleanName}`}
      />
    </ActionPanel>
  );
};

const TokenDetails = ({ token, index }: { token: (typeof light)[0]; index: number }) => (
  <Detail
    // navigationTitle={token.cleanName}
    markdown={`
  # ${token.cleanName}
  ${token.attributes.description}
  ## Value:
  ${
    token.attributes.group === "paint"
      ? `
  **atlassian-light**: ${token.value.toString()}

  **atlassian-dark**: ${dark[index].value.toString()}`
      : JSON.stringify(token.value)
  }
  `}
    metadata={
      <Detail.Metadata>
        <Detail.Metadata.Label title="Group" text={token.attributes.group} />
        <Detail.Metadata.TagList title="State">
          <Detail.Metadata.TagList.Item
            text={token.attributes.state}
            color={stateColorMap[token.attributes.state] || "eed535"}
          />
        </Detail.Metadata.TagList>
        <Detail.Metadata.Separator />
        <Detail.Metadata.Label title="Introduced" text={token.attributes.introduced} />
        {token.attributes.state === "deprecated" && (
          <>
            <Detail.Metadata.Label
              title="Deprecated"
              text={
                // @ts-expect-error 'deprecated' is not in the type
                token.attributes.deprecated || "Unknown"
              }
            />
            <Detail.Metadata.Label
              title="Replacement"
              text={
                // @ts-expect-error 'replacement' is not in the type
                token.attributes.replacement || "Unknown"
              }
            />
          </>
        )}
        {token.attributes.state === "deleted" && (
          <>
            <Detail.Metadata.Label
              title="Deleted"
              text={
                // @ts-expect-error 'deleted' is not in the type
                token.attributes.deleted || "Unknown"
              }
            />
            <Detail.Metadata.Label
              title="Replacement"
              text={
                // @ts-expect-error 'replacement' is not in the type
                token.attributes.replacement || "Unknown"
              }
            />
          </>
        )}
        {token.attributes.state === "experimental" && (
          <>
            <Detail.Metadata.Label
              title="Replacement"
              text={
                // @ts-expect-error 'replacement' is not in the type
                token.attributes.replacement || "Unknown"
              }
            />
            <Detail.Metadata.TagList title="State">
              {
                // @ts-expect-error 'suggest' is not in the type
                token.attributes.suggest.map((suggestion: string, index: number) => (
                  <Detail.Metadata.TagList.Item key={index} text={suggestion} />
                ))
              }
            </Detail.Metadata.TagList>
          </>
        )}
      </Detail.Metadata>
    }
    actions={<TokenActionPanel showDetailAction={false} token={token} index={index} />}
  />
);

const stateColorMap: { [index: string]: string } = {
  active: "#7EE2B8",
  deprecated: "#F5CD47",
  deleted: "#42221F",
  experimental: "#2B273F",
};
