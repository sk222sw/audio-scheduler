export const last = arr => arr[arr.length - 1];
export const withDefault = (fn, def) => fn || def;
export const lastWithDefault = (arr, def) => withDefault(last(arr), def);
export const first = arr => arr[0];
export const firstWithDefault = (arr, def) => withDefault(first(arr), def);
export const repeat = (fn: () => void, times: number) => {
  for (var i = 0; i < times; i++) {
    fn();
  }
};
