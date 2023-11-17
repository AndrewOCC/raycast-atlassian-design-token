import { ActionPanel, Action, Icon } from "@raycast/api";
import { light, dark } from "@atlaskit/tokens/tokens-raw";
import { TokenDetails } from "./TokenDetails";

export const TokenActionPanel = ({
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
