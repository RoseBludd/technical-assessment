import clsx from "clsx";
import Text, { TextProps } from "./Text";

type ParagraphProps = TextProps;

const Paragraph = ({ className, children }: ParagraphProps) => {
  return (
    <Text className={clsx("leading-7 [&:not(:first-child)]:mt-6", className)}>
      {children}
    </Text>
  );
};

export default Paragraph;
