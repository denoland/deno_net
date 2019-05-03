import { BigSource, Big } from "./big/mod.ts";

export function sum(...values: BigSource[]): string {
  if (!values || !values.length) {
    return "0";
  }
  const result = values.reduce(
    (previousValue: BigSource, currentValue: BigSource) => {
      return (previousValue instanceof Big
        ? previousValue
        : new Big(previousValue)
      ).plus(currentValue);
    },
    0
  ) as Big;
  return result.toString();
}
