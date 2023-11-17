import { List, Icon, Color } from "@raycast/api";
import { light, dark } from "@atlaskit/tokens/tokens-raw";
import { TokenActionPanel } from "./TokenActionPanel";

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
