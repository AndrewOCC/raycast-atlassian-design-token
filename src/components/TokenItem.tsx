import { List, Icon, Color } from "@raycast/api";
import { light, dark } from "@atlaskit/tokens/tokens-raw";
import { TokenActionPanel } from "./TokenActionPanel";
import { stateColorMap } from "../constants";

/**
 * TokenItem
 *
 * A component used to render each token in the list.
 * @param colorTheme - The current color theme
 * @param index - The index of the token in its raw list
 * @param token - The token metadata (from its default theme)
 */
export const TokenItem = ({
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
    icon = { source: Icon.Brush };
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

  let displayIcon = icon;
  if (token.attributes.group === "paint") {
    displayIcon = { source: Icon.CircleFilled, tintColor: displayValue as string };
  }

  // ✨ Accessorise ✨
  let accessories: List.Item.Props["accessories"] = [{ tag: { value: token.attributes.group } }];
  if (typeof token.original.value === "string") {
    accessories = [{ tag: { value: token.original.value.toString() } }, ...accessories];
  }
  if (token.attributes.state !== "active") {
    accessories = [
      {
        tag: {
          value: token.attributes.state,
          color: stateColorMap[token.attributes.state] || "eed535",
        },
      },
      ...accessories,
    ];
  }
  if (token.attributes.group === "spacing") {
    accessories = [
      {
        tag: {
          value: token.value.toString().split("px")[0],
          color: "#579DFF",
        },
      },
      ...accessories,
    ];
  }

  return (
    <List.Item
      title={token.cleanName}
      icon={displayIcon}
      subtitle={token.attributes.description}
      accessories={accessories}
      actions={<TokenActionPanel token={token} index={index} />}
    />
  );
};
