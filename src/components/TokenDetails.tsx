import { Detail } from "@raycast/api";
import { light, dark } from "@atlaskit/tokens/tokens-raw";
import { TokenActionPanel } from "./TokenActionPanel";

export const TokenDetails = ({ token, index }: { token: (typeof light)[0]; index: number }) => (
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
